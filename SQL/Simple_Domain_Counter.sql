/* 
	Project: IP Warming - Domain Counts
	Engineer: Don Sedberry
	Notes: This code counts the number of email addresses from the priority domains to help determine number of weeks for a full warm up.
	Requires a Data Extension with the following fields ESP (Text 500) and Subscribers (number)
*/

SELECT TOP 200 SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) AS ESP, COUNT(*) AS Subscribers
FROM [Master_Data_Extension]
GROUP BY SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email]))
ORDER BY Subscribers DESC