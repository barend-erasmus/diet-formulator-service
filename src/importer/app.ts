import * as csvtojson from 'csvtojson';
import { config } from './../config';
import { BaseRepository } from '../repositories/sequelize/base';
import { IDietGroupRepository } from '../repositories/diet-group';
import { DietGroupRepository } from '../repositories/sequelize/diet-group';
import { DietGroup } from '../entities/diet-group';
import { NutrientRepository } from '../repositories/sequelize/nutrient';
import { Nutrient } from '../entities/nutrient';

async function importNutrients() {

    const applicationId: number = 1;

    let data: any[] = await getData('./src/importer/nutrients.csv');

    const nutrientRepository: NutrientRepository = new NutrientRepository(config.database.host, config.database.username, config.database.password);

    for (const item of data) {
        const nutrient: Nutrient = await nutrientRepository.find(applicationId, item.Code);

        if (!nutrient) {
            await nutrientRepository.create(applicationId, new Nutrient(null, item.Name, item.Description, item.Code, item.Abbreviation, item.Unit, item['Sort Order']));
        }
    }

    nutrientRepository.close();
}
async function importFormulas() {

    const applicationId: number = 1;

    let data: any[] = await getData('./src/importer/formulas.csv');

    const filteredData: any[] = [];

    for (const item of data) {
        if (!filteredData.find((x) =>
            x['Group 1'] === item['Group 1'] &&
            x['Group 2'] === item['Group 2'] &&
            x['Group 3'] === item['Group 3'] &&
            x['Group 4'] === item['Group 4'])) {
            filteredData.push(item);
        }
    }

    data = filteredData;

    const dietGroupRepository: DietGroupRepository = new DietGroupRepository(config.database.host, config.database.username, config.database.password);

    for (const item of data) {

        let parentDietGroupId: number = null;
        let dietGroups: DietGroup[] = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);

        if (item['Group 1']) {
            if (!dietGroups.find((x) => x.name === item['Group 1'])) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, item['Group 1'], null, parentDietGroupId ? new DietGroup(parentDietGroupId, null, null, null) : null));

                parentDietGroupId = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            } else {
                parentDietGroupId = dietGroups.find((x) => x.name === item['Group 1']).id;
            }
        }

        if (item['Group 2']) {
            if (!dietGroups.find((x) => x.name === item['Group 2'])) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, item['Group 2'], null, parentDietGroupId ? new DietGroup(parentDietGroupId, null, null, null) : null));

                parentDietGroupId = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            } else {
                parentDietGroupId = dietGroups.find((x) => x.name === item['Group 2']).id;
            }
        }

        if (item['Group 3']) {
            if (!dietGroups.find((x) => x.name === item['Group 3'])) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, item['Group 3'], null, parentDietGroupId ? new DietGroup(parentDietGroupId, null, null, null) : null));

                parentDietGroupId = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            } else {
                parentDietGroupId = dietGroups.find((x) => x.name === item['Group 3']).id;
            }
        }

        if (item['Group 4']) {
            if (!dietGroups.find((x) => x.name === item['Group 4'])) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, item['Group 4'], null, parentDietGroupId ? new DietGroup(parentDietGroupId, null, null, null) : null));

                parentDietGroupId = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            } else {
                parentDietGroupId = dietGroups.find((x) => x.name === item['Group 4']).id;
            }
        }
    }

    dietGroupRepository.close();
}

function getData(fileName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const result: any[] = [];

        csvtojson().fromFile(fileName)
            .on('json', (jsonObj: any[]) => {
                result.push(jsonObj);
            }).on('done', () => {
                resolve(result);
            })
    });
}

importNutrients().then(() => {
    return importFormulas();
}).then(() => {

});