-- Remove special characters
UPDATE public."diets" SET "name" = REPLACE("name", '�', '');
UPDATE public."ingredients" SET "name" = REPLACE("name", '�', '');

-- Add 'User Defined' diet group
INSERT INTO public."dietGroups" ("description", "name", "createdAt", "updatedAt", "applicationId")
VALUES
(null, 'User Defined', NOW(), NOW(), 1);

-- Populate comparison diet table
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
"dietGroup"."dietGroupId" = "comparisonDietGroup"."dietGroupId";

-- Update nutrients
UPDATE public."nutrients" SET 
"abbreviation" = 'Dry Matter',
"name" = 'Dry Matter'
WHERE "code" = 'DM';

UPDATE public."nutrients" SET 
"abbreviation" = 'Crude Protein',
"name" = 'Crude Protein'
WHERE "code" = 'CP';

UPDATE public."nutrients" SET 
"abbreviation" = 'Crude Fiber',
"name" = 'Crude Fiber'
WHERE "code" = 'CF';

UPDATE public."nutrients" SET 
"abbreviation" = 'Ether Extract',
"name" = 'Ether Extract'
WHERE "code" = 'EE';

UPDATE public."nutrients" SET 
"abbreviation" = 'Fat',
"name" = 'Fat from Plant Origin'
WHERE "code" = 'EEP';

UPDATE public."nutrients" SET 
"abbreviation" = 'Acid Detergent Fiber',
"name" = 'Acid Detergent Fiber'
WHERE "code" = 'ADF';

UPDATE public."nutrients" SET 
"abbreviation" = 'Neutral Detergent Fiber',
"name" = 'Neutral Detergent Fiber'
WHERE "code" = 'NDF';

UPDATE public."nutrients" SET 
"abbreviation" = 'Effective Neutral Detergent Fibre',
"name" = 'Effective Neutral Detergent Fibre'
WHERE "code" = 'eNDF';

UPDATE public."nutrients" SET 
"abbreviation" = 'C18H32O2',
"name" = 'Linoleic Acid'
WHERE "code" = 'Linoleic';

UPDATE public."nutrients" SET 
"abbreviation" = 'C20H32O2',
"name" = 'Arachidonic Acid'
WHERE "code" = 'Arachid';

UPDATE public."nutrients" SET 
"abbreviation" = 'Total Digestible Nutrients',
"name" = 'Total Digestible Nutrients for Camelids'
WHERE "code" = 'TDNCamelids';

UPDATE public."nutrients" SET 
"abbreviation" = 'Total Digestible Nutrients',
"name" = 'Total Digestible Nutrients for Cattle'
WHERE "code" = 'TDNCattle';

UPDATE public."nutrients" SET 
"abbreviation" = 'Total Digestible Nutrients',
"name" = 'Total Digestible Nutrients for Sheep'
WHERE "code" = 'TDNSheep';

UPDATE public."nutrients" SET 
"abbreviation" = 'Digestible Energy',
"name" = 'Digestible Energy for Antelopes'
WHERE "code" = 'DEAntelope';

UPDATE public."nutrients" SET 
"abbreviation" = 'Digestible Energy',
"name" = 'Digestible Energy for Camelids'
WHERE "code" = 'DECamelids';

UPDATE public."nutrients" SET 
"abbreviation" = 'Digestible Energy',
"name" = 'Digestible Energy for Deer'
WHERE "code" = 'DEDeer';

UPDATE public."nutrients" SET 
"abbreviation" = 'Digestible Energy',
"name" = 'Digestible Energy for Horses'
WHERE "code" = 'DEHorse';

UPDATE public."nutrients" SET 
"abbreviation" = 'Digestible Energy',
"name" = 'Digestible Energy for Pigs'
WHERE "code" = 'DEPig';

UPDATE public."nutrients" SET 
"abbreviation" = 'Digestible Energy',
"name" = 'Digestible Energy for Sheep'
WHERE "code" = 'DESheep';

UPDATE public."nutrients" SET 
"abbreviation" = 'Metabolizable Energy',
"name" = 'Metabolizable Energy for Cattle'
WHERE "code" = 'MECattle';

UPDATE public."nutrients" SET 
"abbreviation" = 'Metabolizable Energy',
"name" = 'Metabolizable Energy for Cats'
WHERE "code" = 'MECats';

UPDATE public."nutrients" SET 
"abbreviation" = 'Metabolizable Energy',
"name" = 'Metabolizable Energy for Dogs'
WHERE "code" = 'MEDogs';

UPDATE public."nutrients" SET 
"abbreviation" = 'Metabolizable Energy',
"name" = 'Metabolizable Energy for Fish'
WHERE "code" = 'MEFish';

UPDATE public."nutrients" SET 
"abbreviation" = 'Metabolizable Energy',
"name" = 'Metabolizable Energy for Pigs'
WHERE "code" = 'MEPig';

UPDATE public."nutrients" SET 
"abbreviation" = 'Metabolizable Energy',
"name" = 'Metabolizable Energy for Poultry'
WHERE "code" = 'MEPoultry';

UPDATE public."nutrients" SET 
"abbreviation" = 'Metabolizable Energy',
"name" = 'Metabolizable Energy for Sheep'
WHERE "code" = 'MESheep';

UPDATE public."nutrients" SET 
"abbreviation" = 'Net Energy for Maintenance',
"name" = 'Net Energy for Maintenance for Cattle'
WHERE "code" = 'NEmCattle';

UPDATE public."nutrients" SET 
"abbreviation" = 'Net Energy for Gain or Growth',
"name" = 'Net Energy for Gain or Growth for Cattle'
WHERE "code" = 'NEgCattle';

UPDATE public."nutrients" SET 
"abbreviation" = 'Net Energy for Lactation',
"name" = 'Net Energy for Lactation for Cattle'
WHERE "code" = 'NElCattle';

UPDATE public."nutrients" SET 
"abbreviation" = 'Rumen Undegradable Protein',
"name" = 'Rumen Undegradable Protein'
WHERE "code" = 'RUP';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6H14N4O2',
"name" = 'Arginine'
WHERE "code" = 'Arg';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6H9N3O2',
"name" = 'Histidine'
WHERE "code" = 'His';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6H13NO2',
"name" = 'Isoleucine'
WHERE "code" = 'Iso-L';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6H13NO2',
"name" = 'Leucine'
WHERE "code" = 'Leu';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6H14N2O2',
"name" = 'Available Lysine'
WHERE "code" = 'Avail Lys';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6H14N2O2',
"name" = 'Lysine'
WHERE "code" = 'Lys';

UPDATE public."nutrients" SET 
"abbreviation" = 'C5H11NO2S',
"name" = 'Methionine'
WHERE "code" = 'Met';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6H12N2O4S2',
"name" = 'Cystine'
WHERE "code" = 'Cys';

UPDATE public."nutrients" SET 
"abbreviation" = 'C9H11NO2',
"name" = 'Phenylalanine'
WHERE "code" = 'Phe';

UPDATE public."nutrients" SET 
"abbreviation" = 'C5H9NO2',
"name" = 'Proline '
WHERE "code" = 'Proline';

UPDATE public."nutrients" SET 
"abbreviation" = 'C2H7NO3S',
"name" = 'Taurine'
WHERE "code" = 'Taurine';

UPDATE public."nutrients" SET 
"abbreviation" = 'C9H11NO3',
"name" = 'Tyrosine'
WHERE "code" = 'Tyr';

UPDATE public."nutrients" SET 
"abbreviation" = 'C4H9NO3',
"name" = 'Threonine'
WHERE "code" = 'Thr';

UPDATE public."nutrients" SET 
"abbreviation" = 'C11H12N2O2',
"name" = 'Tryptophan'
WHERE "code" = 'Trp';

UPDATE public."nutrients" SET 
"abbreviation" = 'C5H11NO2',
"name" = 'Valine'
WHERE "code" = 'Val';

UPDATE public."nutrients" SET 
"abbreviation" = 'C2H5NO2',
"name" = 'Glycine '
WHERE "code" = 'Gly';

UPDATE public."nutrients" SET 
"abbreviation" = 'C3H7NO3',
"name" = 'Serine'
WHERE "code" = 'Ser';

UPDATE public."nutrients" SET 
"abbreviation" = 'P',
"name" = 'Available Phosphorus'
WHERE "code" = 'Avail P';

UPDATE public."nutrients" SET 
"abbreviation" = 'C5H14NO+',
"name" = 'Choline'
WHERE "code" = 'Choline';

UPDATE public."nutrients" SET 
"abbreviation" = 'C19H19N7O6',
"name" = 'Folic Acid'
WHERE "code" = 'Folic';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6NH5O2',
"name" = 'Nicotinic Acid'
WHERE "code" = 'Niacin';

UPDATE public."nutrients" SET 
"abbreviation" = 'C9H17NO5',
"name" = 'Pantothenic Acid'
WHERE "code" = 'Pantot';

UPDATE public."nutrients" SET 
"abbreviation" = 'C6H12O6',
"name" = 'Inositol'
WHERE "code" = 'Inositol';

UPDATE public."nutrients" SET 
"abbreviation" = 'C27H46O',
"name" = 'Cholesterol'
WHERE "code" = 'Cholest';

-- Removes empty values from ingredient values
DELETE FROM public."ingredientValues"
WHERE "value" = 0