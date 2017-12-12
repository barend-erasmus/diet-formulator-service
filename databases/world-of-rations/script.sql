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
WHERE "value" = 0;

-- Populate supplements
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Arg, as DL-Arginine hydrochloride' AND "nutrient"."code" = 'Arg';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Arg, as L-Arginine monohydrochloride' AND "nutrient"."code" = 'Arg';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Biotin, (Vit H2) 2.0%' AND "nutrient"."code" = 'Vit H2';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Choline, as Choline Chloride (Vit B4) 50%' AND "nutrient"."code" = 'Choline';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Choline, as Choline Chloride (Vit B4) 60%' AND "nutrient"."code" = 'Choline';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Co, from Cobalt Carbonate' AND "nutrient"."code" = 'Co';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Co, from Cobalt Carbonate hexahydrate' AND "nutrient"."code" = 'Co';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Co, from Cobalt dicloride hexahydrate' AND "nutrient"."code" = 'Co';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Cr, from Chromium nicotinate' AND "nutrient"."code" = 'Cr';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Cr, from Chromium picolinate' AND "nutrient"."code" = 'Cr';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Cr, from Chromium yeast' AND "nutrient"."code" = 'Cr';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Cu, from Cupric chloride dihydrate' AND "nutrient"."code" = 'Cu';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Cu, from Cupric oxide' AND "nutrient"."code" = 'Cu';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Cu, from Cupric sulphate pentahydrate' AND "nutrient"."code" = 'Cu';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Cys, as Cystine or DL-Cystine' AND "nutrient"."code" = 'Cys';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Fe, from Ferrous sulphate' AND "nutrient"."code" = 'Fe';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Folic, as Folic Acid (Vit B9)' AND "nutrient"."code" = 'Folic';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Gly, as Glycine' AND "nutrient"."code" = 'Gly';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'His, as DL-Histidine' AND "nutrient"."code" = 'His';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'His, as L-Histidine monohydochloride' AND "nutrient"."code" = 'His';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'I, from Ethylene-diamino-dihydroiodide (EDDI)' AND "nutrient"."code" = 'I';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'I, from Potassium iodide' AND "nutrient"."code" = 'I';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Inositol, as Myo-Inositol (previously known as Vit B8)' AND "nutrient"."code" = 'Inositol';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Iso-L, as L-Iso-Leucine' AND "nutrient"."code" = 'Iso-L';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Leu, as L-Leucine' AND "nutrient"."code" = 'Leu';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Lys, as L-Lysine' AND "nutrient"."code" = 'Lys';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Lys, as L-Lysine liquid concentrate' AND "nutrient"."code" = 'Lys';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Lys, as L-Lysine monohydrochloride' AND "nutrient"."code" = 'Lys';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Lys, as L-Lysine sulphate' AND "nutrient"."code" = 'Lys';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Met, as DL-Methionine' AND "nutrient"."code" = 'Met';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Met, as DL-Methionine liquid concentrate' AND "nutrient"."code" = 'Met';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mn, from Manganese carbonate' AND "nutrient"."code" = 'Mn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mn, from Manganese chloride' AND "nutrient"."code" = 'Mn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mn, from Manganese chloride tetrahydrate' AND "nutrient"."code" = 'Mn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mn, from Manganese oxide' AND "nutrient"."code" = 'Mn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mn, from Manganese sulphate monohydrate' AND "nutrient"."code" = 'Mn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mn, from Manganese sulphate pentahydrate' AND "nutrient"."code" = 'Mn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mo, from Ammonium molybdate' AND "nutrient"."code" = 'Mo';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mo, from Molybdenum trioxide' AND "nutrient"."code" = 'Mo';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Mo, from Sodium Molybdate dihydrate' AND "nutrient"."code" = 'Mo';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Niacin, as Nicotinic Acid (Vit B3)' AND "nutrient"."code" = 'Niacin';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Pantot, as Pantothenic acid (Vit B5)' AND "nutrient"."code" = 'Pantot';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Phe, as DL-, D-, or L-Phenylalanine' AND "nutrient"."code" = 'Phe';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Proline, as Proline' AND "nutrient"."code" = 'Proline';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'S, as Ammonium Sulphate ((NH4)2SO4)' AND "nutrient"."code" = 'S';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'S, as Flowers Sulphur (S)' AND "nutrient"."code" = 'S';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Se, from Sodium Selenate decahydrate' AND "nutrient"."code" = 'Se';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Se, from Sodium Selenite' AND "nutrient"."code" = 'Se';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Ser, as L-Serine' AND "nutrient"."code" = 'Ser';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Taurine, as Taurine' AND "nutrient"."code" = 'Taurine';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Thr, as L-Threonine' AND "nutrient"."code" = 'Thr';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Trp, as L-Tryptophan' AND "nutrient"."code" = 'Trp';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Tyr, as L-Tyrosine' AND "nutrient"."code" = 'Typ';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Val, as L-Valine' AND "nutrient"."code" = 'Val';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit A, from Vit A Acetate 250' AND "nutrient"."code" = 'Vit A';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit A, from Vit A Acetate 325' AND "nutrient"."code" = 'Vit A';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit A, from Vit A Acetate 500' AND "nutrient"."code" = 'Vit A';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit A, from Vit A Palmitate 250' AND "nutrient"."code" = 'Vit A';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit A, from Vit A Palmitate 500' AND "nutrient"."code" = 'Vit A';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B1, (Thiamine), from Vita-B1 supplied by Allivet' AND "nutrient"."code" = 'Vit B1';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B1, from Thiamine hydrochloride 98%' AND "nutrient"."code" = 'Vit B1';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B1, from Thiamine mono-nitrate 98%' AND "nutrient"."code" = 'Vit B1';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B12, as the 1.0 % product (Cyanocobalamin)' AND "nutrient"."code" = 'Vit B12';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B12, as the 0.1% product (Cyanocobalamin)' AND "nutrient"."code" = 'Vit B12';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B12, as the 10.0% product (Cyanocobalamin)' AND "nutrient"."code" = 'Vit B12';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B2, as the 0.1% product (Riboflavin)' AND "nutrient"."code" = 'Vit B2';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B2, as the 1% product (Riboflavin)' AND "nutrient"."code" = 'Vit B2';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit B6, (Pyridoxine)' AND "nutrient"."code" = 'Vit B6';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit C, as a Fat-coated Ascorbic Acid' AND "nutrient"."code" = 'Vit C';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit C, as a Phosphorylated Ascorbic Acid' AND "nutrient"."code" = 'Vit C';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit C, as an Ethylcellulose-coated Ascorbic Acid' AND "nutrient"."code" = 'Vit C';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit D, from Vit D2 Oil (Ergocalciferol)' AND "nutrient"."code" = 'Vit D';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit D, from Vit D3 Oil (Cholecalciferol)' AND "nutrient"."code" = 'Vit D';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit D, from Vit D3 100' AND "nutrient"."code" = 'Vit D';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit D, from Vit D3 50' AND "nutrient"."code" = 'Vit D';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit D, from Vit D3 500' AND "nutrient"."code" = 'Vit D';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit E, from Vit E Acetate 50%' AND "nutrient"."code" = 'Vit E';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit E, from Vit E Acetate 500' AND "nutrient"."code" = 'Vit E';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit K, from Vit K 1%' AND "nutrient"."code" = 'Vit K';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Vit K, from Vit K 5%' AND "nutrient"."code" = 'Vit K';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Zn, from Zinc carbonate' AND "nutrient"."code" = 'Zn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Zn, from Zinc chloride' AND "nutrient"."code" = 'Zn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Zn, from Zinc oxide' AND "nutrient"."code" = 'Zn';
INSERT INTO public."supplements" ("nutrientId", "ingredientId", "createdAt", "updatedAt") SELECT "nutrient"."id", "ingredient"."id", NOW(), NOW() FROM public."nutrients" AS "nutrient" INNER JOIN public."ingredients" AS "ingredient" ON "ingredient"."name" = 'Zn, from Zinc sulphate monhydrate' AND "nutrient"."code" = 'Zn';

-- Update ration groups
UPDATE public."dietGroups" SET 
"description" = 'The ''Micronutrients excluded'' option formulates a least-cost ration in two stages. It first formulates a ration to its macronutrient stage and supplies thereafter a supplement micronutrient mix which, when added to the feed, will rectify all deficiencies found in the initial macronutrient formulation.',
"name" = 'Micronutrients excluded'
WHERE "name" = 'MNE';

UPDATE public."dietGroups" SET 
"description" = 'The ''Micronutrients included'' option is meant for those who know exactly which or what feedstuffs are necessary to arrive at a successful solution and is ideal for professionals.',
"name" = 'Micronutrients included'
WHERE "name" = 'MNI';

