Select
    c.[CampaignMember:Common:Email] as Subscriberkey
FROM
    [SOURCE DATA EXTENSION] c
    Left join _subscribers s ON c.[CampaignMember:Common:Email] = s.Subscriberkey
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            _BusinessUnitUnsubscribes bu
        WHERE
            bu.Subscriberkey = c.[CampaignMember:Common:Email]
    )
    AND NOT EXISTS (
        SELECT
            1
        FROM
            ent._Unsubscribe u
        WHERE
            u.Subscriberkey = c.[CampaignMember:Common:Email]
    )
    /*#####################################*/
Select
    S.*
FROM
    _sent S
WHERE
    EXISTS (
        SELECT
            1
        FROM
            [SOURCE DATA EXTENSION] c
        WHERE
            s.Subscriberkey = c.[Email]
    )
    /*#####################################*/
Select
    S.*
FROM
    _Open S
WHERE
    EXISTS (
        SELECT
            1
        FROM
            [SOURCE DATA EXTENSION] c
        WHERE
            s.Subscriberkey = c.[Email]
    )
    /*#####################################*/
Select
    S.*
FROM
    _click S
WHERE
    EXISTS (
        SELECT
            1
        FROM
            [SOURCE DATA EXTENSION] c
        WHERE
            s.Subscriberkey = c.[Email]
    )