SELECT DISTINCT
    s.SubscriberKey,
    s.JobID,
    s.BatchID,
    convert(char(19), s.EventDate, 20) as SendDate
FROM
    [_sent] s
    LEFT JOIN [_open] o ON s.JobID = o.JobID
    AND s.ListID = o.ListID
    AND s.BatchID = o.BatchID
    AND s.SubscriberID = o.SubscriberID
    AND o.IsUnique = 1
    LEFT JOIN [_click] c ON s.JobID = c.JobID
    AND s.ListID = c.ListID
    AND s.BatchID = c.BatchID
    AND s.SubscriberID = c.SubscriberID
    AND c.IsUnique = 1
WHERE o.SubscriberID is NULL
    AND c.SubscriberID is NULL
    