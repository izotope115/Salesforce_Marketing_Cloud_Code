/*Example SQL query that date/time stamps every row*/
SELECT  Email,
GETDATE() AS 'Date' /*This will date/time stamp each row. 'Date' is the attribute located in your target table*/

FROM 
Contact_Salesforce

WHERE Email = 'sueprospect@example.com'