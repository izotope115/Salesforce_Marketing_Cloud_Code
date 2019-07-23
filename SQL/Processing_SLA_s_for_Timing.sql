/* 
	Project: Processing SLA's for Timing  - Entry Query
	Engineer: Don Sedberry
	Notes: This query was designed to support customers who have different levels of communication SLAs revolving around a downtime 
	incident for a software product. This query decides who should be pulled into the current audience (run 4x hourly) by calculating both when the incident started versus the number of intervals that have occurred since the last notification. Utilizing Modulo to check for 0 remainder after rounding to the nearest 15 minute interval. We can control the population using the same query 4x an hour (in 4 different automations).
*/
SELECT
		Id
	,	Email 
	,   ((DateDiff(minute, DateAdd(minute, Round( DateDiff(minute, 0, GetDate() ) / 15.0, 0) * 15, 0),DateAdd(minute, Round( DateDiff(minute, 0, Created_Date_Time__c) / 15.0, 0) * 15, 0)) * -1)/15) % 2 AS TimeCalc
FROM Journey_Staging
WHERE
	1 = CASE 
			WHEN Notification_Interval__c = '15' THEN 1
			WHEN Notification_Interval__c = '30' AND ((DateDiff(minute, DateAdd(minute, Round( DateDiff(minute, 0, GetDate() ) / 15.0, 0) * 15, 0),DateAdd(minute, Round( DateDiff(minute, 0, Created_Date_Time__c) / 15.0, 0) * 15, 0)) * -1)/15) % 2 = 0 THEN 1
			WHEN Notification_Interval__c = '45' AND ((DateDiff(minute, DateAdd(minute, Round( DateDiff(minute, 0, GetDate() ) / 15.0, 0) * 15, 0),DateAdd(minute, Round( DateDiff(minute, 0, Created_Date_Time__c) / 15.0, 0) * 15, 0)) * -1)/15) % 3 = 0 THEN 1 
			WHEN Notification_Interval__c = '60' AND ((DateDiff(minute, DateAdd(minute, Round( DateDiff(minute, 0, GetDate() ) / 15.0, 0) * 15, 0),DateAdd(minute, Round( DateDiff(minute, 0, Created_Date_Time__c) / 15.0, 0) * 15, 0)) * -1)/15) % 4 = 0 THEN 1
			ELSE 0
		END 