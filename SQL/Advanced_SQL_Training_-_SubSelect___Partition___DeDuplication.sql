/*
	Project: Advanced SQL Training - SubSelect / Partition / DeDuplication
	Engineer: Don Sedberry
	Notes: Id is "Contact Id" and the SubscriberKey for this particular data set.
*/
SELECT
		SubSel.Email
	, 	SubSel.Id
FROM 
	(
	  	SELECT
		  		Welcome.Email
		  	, 	Welcome.Id
		  	, 	Welcome.InsertDate
		  	, 	row_number() OVER (PARTITION BY Welcome.Id ORDER BY Welcome.InsertDate ASC) Ranking
	  	FROM Welcome_Journey Welcome
	) SubSel /* Granting the results of the SubSelect an Alias to reference outside of the sub select */
WHERE
	SubSel.Ranking = 1 
	/* Due to the Ascending Order defined in the Partition above it is looking for the oldest date first */
	/* You could define additional parameters from the sub select data */
	/* Example: CAST(InsertDate AS DATE) > DateAdd( day, -31, GetDate) to pull only the last 30 days */
 
/* Example Results of SubSel
	Note that there are duplicates but they are ordered	ascending with the oldest date 
	ranked first as number 1. This is how the query pulls distinct values and 
	deduplicates the data. 
*/
/* 		Email			|	   Id 				|  		InsertDate		| 	Ranking 	*/
/*	example@test.com		003ABCDEFGHIJKLMN		July 20, 2019 12:00			1		*/
/*	example@test.com		003ABCDEFGHIJKLMN		July 21, 2019 12:00			2		*/
/*	example@test.com		003ABCDEFGHIJKLMN		July 22, 2019 12:00			3		*/
/*	example2@test.com		003NMOPQURSLETVFX		July 20, 2019 12:00			1		*/
/*	example2@test.com		003NMOPQURSLETVFX		July 21, 2019 12:00			2		*/
/*	example2@test.com		003NMOPQURSLETVFX		July 22, 2019 12:00			3		*/