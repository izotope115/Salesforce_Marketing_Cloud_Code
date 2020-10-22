/*First step is to get the information on the all Running and Stopped version of journeys for Email Activity */

SELECT
    j.VersionID,
    JourneyID,
    JourneyName,
    VersionNumber,
    CreatedDate,
    LastPublishedDate,
    ModifiedDate,
    JourneyStatus,
    ActivityName,
    ActivityExternalKey,
    JourneyActivityObjectID,
    ActivityType
FROM
    _Journey j
    JOIN (
        SELECT
            VersionID,
            ActivityName = MAX(ActivityName),
            JourneyActivityObjectID = max(JourneyActivityObjectID),
            MIN(ActivityType) ActivityType,
            ActivityExternalKey
        FROM
            _JourneyActivity
        WHERE
            ActivityType like 'EMAILV%'
            and JourneyActivityObjectID is not null
        GROUP BY
            VersionID,
            ActivityExternalKey
    ) ja on j.VersionID = ja.VersionID
    and JourneyStatus in ('Running', 'Stopped')

    /*Next step is the engagement of subscribers within the journeys*/

SELECT
    Distinct JourneyName,
    VersionNumber,
    ActivityName,
    JourneyActivityObjectID,
    s.SubscriberKey,
    SentDate = s.EventDate,
    OpenDate = o.EventDate,
    ClickDate = c.EventDate,
    Unsubscribed = CASE
        WHEN u.SubscriberId IS NOT NULL THEN 'true'
        else null
    end,
    s.JobID,
    b.BounceCategory,
    jo.EmailName,
    jo.EmailSubject
FROM
    JourneyActivities_Information j
    INNER JOIN _Sent s ON j.JourneyActivityObjectID = s.TriggererSendDefinitionObjectID
    AND JourneyName not like '%Test%' /*the journeys pulled can be limited*/
    LEFT JOIN _Open o ON s.JobId = o.JobId
    AND s.SubscriberId = o.SubscriberId
    AND s.TriggererSendDefinitionObjectID = o.TriggererSendDefinitionObjectID
    AND o.IsUnique = 'true'
    LEFT JOIN _Click c ON s.JobId = c.JobId
    AND s.SubscriberId = c.SubscriberId
    AND s.TriggererSendDefinitionObjectID = c.TriggererSendDefinitionObjectID
    AND c.IsUnique = 'true'

    LEFT JOIN _Job jo ON s.JobId = jo.JobId
    LEFT JOIN _Bounce b on s.JobId = b.JobId
    AND s.SubscriberId = b.SubscriberId
    AND s.TriggererSendDefinitionObjectID = b.TriggererSendDefinitionObjectID
    AND b.IsUnique = 'true'
    LEFT JOIN _Unsubscribe u ON s.JobId = u.JobId
    AND s.SubscriberId = u.SubscriberId
    AND u.IsUnique = 'true'
    AND u.AccountID = 7206841 
WHERE
     ActivityName is not null
    and EmailName is not null
    and EmailSubject is not null
    and s.EventDate is not null

    /*Next step is to get the aggregate information*/

SELECT
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    SubscribersCount = Count(j.SubscriberKey),
    SentCount = count(j.SendDate),
    OpenCount = Count(j.OpenDate),
    ClickCount = Count(j.ClickDate),
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    TotalBounces = count(j.BounceCategory),
    UnsubCount = count(j.Unsubscribed),
    sum(
        case
            when j.BounceCategory not in('Hard bounce', 'Block bounce') then 1
            else 0
        end
    ) SoftBounces,
    sum(
        case
            when j.BounceCategory = 'Hard bounce' then 1
            else 0
        end
    ) HardBounces,
    sum(
        case
            when j.BounceCategory = 'Block bounce' then 1
            else 0
        end
    ) BlockBounces,
    SendDate = Min(j.SendDate),
    OpenRate =CASE
        WHEN count(j.SendDate) - count(j.BounceCategory) = 0 then null
        else CAST(
            (
                CAST(Count(j.OpenDate) AS Float) / CAST(
                    (count(j.SendDate) - count(j.BounceCategory)) AS FLOAT
                )
            ) * 100 as float
        )
    end,
    ClickRate =CASE
        WHEN count(j.SendDate) - count(j.BounceCategory) = 0 then null
        else CAST(
            (
                CAST(Count(j.ClickDate) AS Float) / CAST(
                    (count(j.SendDate) - count(j.BounceCategory)) AS FLOAT
                )
            ) * 100 as float
        )
    end,
    UnsubRate =CASE
        WHEN count(j.SendDate) - count(j.BounceCategory) = 0 then null
        else CAST(
            (
                CAST(Count(j.Unsubscribed) AS Float) / CAST(
                    (count(j.SendDate) - count(j.BounceCategory)) AS FLOAT
                )
            ) * 100 as float
        )
    end,
    BounceRate =CASE
        WHEN count(j.SendDate) = 0 then null
        else CAST(
            (
                CAST(Count(j.BounceCategory) AS Float) / CAST(count(j.SendDate) AS FLOAT)
            ) * 100 as float
        )
    end,
    OpenDistinct = (
        select
            count(*)
        from
            (
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    ActivityName = j.ActivityName
                    and EmailName = j.EmailName
                    and JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and opendate is not null
                    and CONVERT(date, SendDate) = CONVERT(date, j.SendDate)
                Except
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and opendate is not null
                    and (
                        (
                            CONVERT(date, SendDate) = CONVERT(date, j.SendDate)
                            and ActivityName != j.ActivityName
                            and EmailName != j.EmailName
                        )
                        or CONVERT(date, SendDate) < CONVERT(date, j.SendDate)
                    )
            ) temp
    )
FROM
    Journey_Engagement_Information j
GROUP BY
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    CONVERT(date, j.SendDate)

    /*Update each of the additional fields since Marketing cloud can't have these in one query (Update to the last data extension)
     Cumulative number that client wanted is basically the number of subscribers that are unique for this specific step that are not in the steps prior to this. Let’s say 10 people opened the first email in the journey, then there are 20 people who opened email 2 but 5 of them are from the people that opened email 1 so the cumulative number for email 2 will be 15.
     */

SELECT
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    SendDate = Min(j.SentDate),
    ClickDistinct = (
        select
            count(*)
        from
            (
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    ActivityName = j.ActivityName
                    and EmailName = j.EmailName
                    and JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and ClickDate is not null
                    and CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                Except
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and ClickDate is not null
                    and (
                        (
                            CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                            and ActivityName != j.ActivityName
                            and EmailName != j.EmailName
                        )
                        or CONVERT(date, SentDate) < CONVERT(date, j.SentDate)
                    )
            ) temp
    )
FROM
    Journey_Engagement_Information j
GROUP BY
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    CONVERT(date, j.SentDate)

    /**/

SELECT
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    SendDate = Min(j.SentDate),
    UnsubDistinct = (
        select
            count(*)
        from
            (
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    ActivityName = j.ActivityName
                    and EmailName = j.EmailName
                    and JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and Unsubscribed is not null
                    and CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                Except
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and Unsubscribed is not null
                    and (
                        (
                            CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                            and ActivityName != j.ActivityName
                            and EmailName != j.EmailName
                        )
                        or CONVERT(date, SentDate) < CONVERT(date, j.SentDate)
                    )
            ) temp
    )
FROM
    Journey_Engagement_Information j
GROUP BY
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    CONVERT(date, j.SentDate)

/**/

SELECT
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    SendDate = Min(j.SentDate),
    SoftBouncesDistinct = (
        select
            count(*)
        from
            (
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    ActivityName = j.ActivityName
                    and EmailName = j.EmailName
                    and JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and BounceCategory not in ('Hard bounce', 'Block bounce')
                    and CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                Except
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and BounceCategory not in ('Hard bounce', 'Block bounce')
                    and (
                        (
                            CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                            and ActivityName != j.ActivityName
                            and EmailName != j.EmailName
                        )
                        or CONVERT(date, SentDate) < CONVERT(date, j.SentDate)
                    )
            ) temp
    )
FROM
    Journey_Engagement_Information j
GROUP BY
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    CONVERT(date, j.SentDate)

/**/

SELECT
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    SendDate = Min(j.SentDate),
    HardBouncesDistinct = (
        select
            count(*)
        from
            (
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    ActivityName = j.ActivityName
                    and EmailName = j.EmailName
                    and JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and BounceCategory = 'Hard bounce'
                    and CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                Except
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and BounceCategory = 'Hard bounce'
                    and (
                        (
                            CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                            and ActivityName != j.ActivityName
                            and EmailName != j.EmailName
                        )
                        or CONVERT(date, SentDate) < CONVERT(date, j.SentDate)
                    )
            ) temp
    )
FROM
    Journey_Engagement_Information j
GROUP BY
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    CONVERT(date, j.SentDate)

/**/

SELECT
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    SendDate = Min(j.SentDate),
    BlockBouncesDistinct = (
        select
            count(*)
        from
            (
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    ActivityName = j.ActivityName
                    and EmailName = j.EmailName
                    and JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and BounceCategory = 'Block bounce'
                    and CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                Except
                select
                    distinct SubscriberKey
                from
                    Journey_Engagement_Information
                where
                    JourneyName = j.JourneyName
                    and VersionNumber = j.VersionNumber
                    and AccountName = j.AccountName
                    and BounceCategory = 'Block bounce'
                    and (
                        (
                            CONVERT(date, SentDate) = CONVERT(date, j.SentDate)
                            and ActivityName != j.ActivityName
                            and EmailName != j.EmailName
                        )
                        or CONVERT(date, SentDate) < CONVERT(date, j.SentDate)
                    )
            ) temp
    )
FROM
    Journey_Engagement_Information j
GROUP BY
    j.JourneyName,
    j.VersionNumber,
    j.ActivityName,
    j.AccountName,
    j.EmailName,
    j.EmailSubject,
    CONVERT(date, j.SentDate)