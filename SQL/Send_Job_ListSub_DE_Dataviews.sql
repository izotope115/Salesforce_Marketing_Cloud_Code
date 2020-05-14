SELECT
"YOUR_DE_NAME"."DE_ATTRIBUTE" as DE_ATTRIBUTE,
"YOUR_DE_NAME"."DE_ATTRIBUTE" as DE_ATTRIBUTE,
"YOUR_DE_NAME"."DE_ATTRIBUTE" as DE_ATTRIBUTE,
_Sent.EventDate as SentOn,
_Sent.JobID as SentJobID,
_Job.JobID	as JobID,
_Job.DeliveredTime	as DeliveredTime,
_Job.EmailName as EmailName,
l.Status as Status

FROM YOUR_DE_NAME

JOIN _Sent ON "YOUR_DE_NAME"."DE_ATTRIBUTE" = _Sent."SubscriberKey"
JOIN _Job ON "_Job"."JobID" = _Sent.JobID
LEFT JOIN ent._listsubscribers l ON "YOUR_DE_NAME"."DE_ATTRIBUTE" = l.EmailAddress

#Filter example using DE attributes
WHERE Touchpoint='T1' OR Touchpoint='T2' OR Touchpoint='T3' OR Touchpoint='T4'