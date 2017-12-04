import * as csvtojson from 'csvtojson';
import { DietGroup } from '../entities/diet-group';
import { Nutrient } from '../entities/nutrient';
import { IDietGroupRepository } from '../repositories/diet-group';
import { BaseRepository } from '../repositories/sequelize/base';
import { DietGroupRepository } from '../repositories/sequelize/diet-group';
import { NutrientRepository } from '../repositories/sequelize/nutrient';
import { config } from './../config';
import { DietRepository } from '../repositories/sequelize/diet';
import { Diet } from '../entities/diet';
import { DietValue } from '../entities/diet-value';
import { IngredientGroupRepository } from '../repositories/sequelize/ingredient-group';
import { IngredientGroup } from '../entities/ingredient-group';
import { Ingredient } from '../entities/ingredient';
import { IngredientValue } from '../entities/ingredient-value';
import { IngredientRepository } from '../repositories/sequelize/ingredient';

async function importNutrients() {

    const applicationId: number = 1;

    const data: any[] = await getData('./src/importer/nutrients.csv');

    const nutrientRepository: NutrientRepository = new NutrientRepository(config.database.host, config.database.username, config.database.password);

    for (const item of data) {
        const nutrient: Nutrient = await nutrientRepository.find(applicationId, item.Code);

        if (!nutrient) {
            await nutrientRepository.create(applicationId, new Nutrient(null, item['Name'], item['Description'], item['Code'], item['Abbreviation'], item['Unit'], item['Sort Order']));
            console.log(`Imported Nutrient '${item['Name']}'`);
        }
    }

    nutrientRepository.close();
}
async function importRations() {

    const applicationId: number = 1;

    let data: any[] = await getData('./src/importer/rations.csv');

    const rations: any[] = [];

    for (const item of data) {
        const ration: any = rations.find((x) =>
            x.group1 === item['Group 1'] &&
            x.group2 === item['Group 2'] &&
            x.group3 === item['Group 3'] &&
            x.group4 === item['Group 4'] &&
            x.name === item['Name']);

        if (ration) {
            ration.values.push({
                maximum: item['Maximum']? parseFloat(item['Maximum']) : null,
                minimum: item['Minimum']? parseFloat(item['Minimum']) : null,
                nutrient: item['Nutrient'],
            });
        } else {
            rations.push({
                group1: item['Group 1'],
                group2: item['Group 2'],
                group3: item['Group 3'],
                group4: item['Group 4'],
                name: item['Name'],
                values: [
                    {
                        maximum: item['Maximum']? parseFloat(item['Maximum']) : null,
                        minimum: item['Minimum']? parseFloat(item['Minimum']) : null,
                        nutrient: item['Nutrient'],
                    }
                ],
            })
        }
    }

    const nutrientRepository: NutrientRepository = new NutrientRepository(config.database.host, config.database.username, config.database.password);
    const dietGroupRepository: DietGroupRepository = new DietGroupRepository(config.database.host, config.database.username, config.database.password);
    const dietRepository: DietRepository = new DietRepository(config.database.host, config.database.username, config.database.password);

    const nutrients: Nutrient[] = await nutrientRepository.list(applicationId);

    for (const ration of rations) {

        let parentDietGroupId: number = null;
        let dietGroups: DietGroup[] = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);

        if (ration.group1) {
            if (!dietGroups.find((x) => x.name === ration.group1)) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, ration.group1, null, parentDietGroupId ? new DietGroup(parentDietGroupId, null, null, null) : null));
                console.log(`Imported Diet Group '${ration.group1}'`);

                parentDietGroupId = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            } else {
                parentDietGroupId = dietGroups.find((x) => x.name === ration.group1).id;
                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            }
        }

        if (ration.group2) {
            if (!dietGroups.find((x) => x.name === ration.group2)) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, ration.group2, null, parentDietGroupId ? new DietGroup(parentDietGroupId, null, null, null) : null));
                console.log(`Imported Diet Group '${ration.group2}'`);

                parentDietGroupId = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            } else {
                parentDietGroupId = dietGroups.find((x) => x.name === ration.group2).id;
                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            }
        }

        if (ration.group3) {
            if (!dietGroups.find((x) => x.name === ration.group3)) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, ration.group3, null, parentDietGroupId ? new DietGroup(parentDietGroupId, null, null, null) : null));
                console.log(`Imported Diet Group '${ration.group3}'`);

                parentDietGroupId = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            } else {
                parentDietGroupId = dietGroups.find((x) => x.name === ration.group3).id;
                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            }
        }

        if (ration.group4) {
            if (!dietGroups.find((x) => x.name === ration.group4)) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, ration.group4, null, parentDietGroupId ? new DietGroup(parentDietGroupId, null, null, null) : null));
                console.log(`Imported Diet Group '${ration.group4}'`);

                parentDietGroupId = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            } else {
                parentDietGroupId = dietGroups.find((x) => x.name === ration.group4).id;
                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            }
        }

        await dietRepository.create(new Diet(
            null,
            ration.name,
            null,
            null,
            new DietGroup(parentDietGroupId, null, null, null),
            ration.values.map((x) => new DietValue(null, x.minimum, x.maximum, nutrients.find((y) => y.code === x.nutrient)))
        ));

        console.log(`Imported Diet '${ration.name}'`);

    }

    nutrientRepository.close();
    dietGroupRepository.close();
    dietRepository.close();
}

async function importFeedstuffs() {
    
        const applicationId: number = 1;
    
        let data: any[] = await getData('./src/importer/feedstuffs.csv');
    
        const feedstuffs: any[] = [];
    
        for (const item of data) {
            const feedstuff: any = feedstuffs.find((x) =>
                x.group === item['Group'] &&
                x.name === item['Name']);
    
            if (feedstuff) {
                feedstuff.values.push({
                    nutrient: item['Nutrient'],
                    value: item['Value']? parseFloat(item['Value']) : null,
                });
            } else {
                feedstuffs.push({
                    group: item['Group'],
                    name: item['Name'],
                    values: [
                        {
                            nutrient: item['Nutrient'],
                            value: item['Value']? parseFloat(item['Value']) : null,
                        }
                    ],
                })
            }
        }
    
        const nutrientRepository: NutrientRepository = new NutrientRepository(config.database.host, config.database.username, config.database.password);
        const ingredientGroupRepository: IngredientGroupRepository = new IngredientGroupRepository(config.database.host, config.database.username, config.database.password);
        const ingredientRepository: IngredientRepository = new IngredientRepository(config.database.host, config.database.username, config.database.password);
    
        const nutrients: Nutrient[] = await nutrientRepository.list(applicationId);
    
        for (const feedstuff of feedstuffs) {
    
            const ingredientGroups: IngredientGroup[] = await ingredientGroupRepository.list(applicationId);

            let ingredientGroup: IngredientGroup = ingredientGroups.find((x) => x.name === feedstuff.group);

            if (!ingredientGroup) {
                ingredientGroup = await ingredientGroupRepository.create(applicationId, new IngredientGroup(null, feedstuff.group, null));
                console.log(`Imported Ingredient Group '${feedstuff.group}'`);
            }
    
            await ingredientRepository.create(new Ingredient(
                null,
                feedstuff.name,
                null,
                null,
                ingredientGroup,
                feedstuff.values.map((x) => new IngredientValue(null, x.value, nutrients.find((y) => y.code === x.nutrient)))
            ));

            console.log(`Imported Ingredient '${feedstuff.name}'`);
    
        }
        
        nutrientRepository.close();
        ingredientGroupRepository.close();
        ingredientRepository.close();
    }

function getData(fileName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const result: any[] = [];

        csvtojson().fromFile(fileName)
            .on('json', (jsonObj: any[]) => {
                result.push(jsonObj);
            }).on('done', () => {
                resolve(result);
            });
    });
}

// importNutrients().then(() => {
//     return importRations();
// }).then(() => {
//     return importFeedstuffs();
// }).catch((err) => {
//     console.log(err.stack);
// });


importFeedstuffs().then(() => {

}).catch((err) => {
    console.log(err.stack);
});