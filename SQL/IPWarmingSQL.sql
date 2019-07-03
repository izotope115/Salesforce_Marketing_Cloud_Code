/* 
	Project: Week 1 IP Warming SQL (USA DOMAINS ONLY)
	Engineer: Don Sedberry
	Notes: This code pulls a max sending segment for a single day of week 1 ip warming.
	To create multiple segments without duplicates add code to check to see if the email 
	already exists in a data extension to each WHERE clause. To adjust for weeks 2 and 3: double the number 
	after TOP (Ex. Week2 40000 Week3 80000 Week4 160000)
*/

SELECT TOP 20000
	,	email
	,	first_name
FROM [Master_Data_Extension]
WHERE 
	SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) IN ('aol.com','yahoo.com','ymail.com','rocketmail.com')

UNION

SELECT TOP 20000
	,	email
	,	first_name
FROM [Master_Data_Extension]
WHERE 
	SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) IN ('hotmail.com','outlook.com','live.com','msn.com','passport.com')

UNION

SELECT TOP 20000
	,	email
	,	first_name
FROM [Master_Data_Extension]
WHERE 
	SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) IN ('gmail.com')

UNION

SELECT TOP 20000
	,	email
	,	first_name
FROM [Master_Data_Extension]
WHERE 
	SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) IN ('ameritech.net','att.net','bellsouth.net','flash.net','nvbell.net','pacbell.net','prodigy.net','sbcglobal.net','snet.net','swbell.net','wans.net')

UNION

SELECT TOP 20000
	,	email
	,	first_name
FROM [Master_Data_Extension]
WHERE 
	SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) IN ('charter.net','spectrum.net')

UNION

SELECT TOP 20000
	,	email
	,	first_name
FROM [Master_Data_Extension]
WHERE 
	SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) IN ('optimum.net','optonline.net')

UNION

SELECT TOP 20000
	,	email
	,	first_name
FROM [Master_Data_Extension]
WHERE 
	SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) IN ('xfinity.net','comcast.net')

UNION

SELECT TOP 20000
	,	email
	,	first_name
FROM [Master_Data_Extension]
WHERE 
	SUBSTRING([email], CHARINDEX('@',[email]) + 1, LEN([email])) IN ('icloud.com','me.com','mac.com')