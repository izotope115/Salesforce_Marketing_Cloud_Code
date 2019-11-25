SELECT
EmailAddress,
Status,
SubscriberKey,
DateUnsubscribed as 'UnsubscribeDate'

FROM _Subscribers

WHERE
Status = 'Unsubscribed'

AND
DateUnsubscribed > dateadd(hh,-24,getdate())
