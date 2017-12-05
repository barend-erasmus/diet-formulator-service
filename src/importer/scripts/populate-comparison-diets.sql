INSERT INTO
public."comparisonDiets"
("createdAt", "updatedAt" ,"dietId", "comparisonDietId")
SELECT
NOW(),
NOW(),
"diet"."id",
"comparisonDiet"."id"
FROM public."diets" AS "diet"
INNER JOIN public."dietGroups" AS "dietGroup"
ON
"dietGroup"."id" = "diet"."dietGroupId"
AND 
"dietGroup"."name" = 'MNE'
INNER JOIN public."diets" AS "comparisonDiet"
ON
"comparisonDiet"."name" = "diet"."name"
INNER JOIN public."dietGroups" AS "comparisonDietGroup"
ON
"comparisonDietGroup"."id" = "comparisonDiet"."dietGroupId"
AND 
"comparisonDietGroup"."name" = 'MNI'
AND 
"dietGroup"."dietGroupId" = "comparisonDietGroup"."dietGroupId"