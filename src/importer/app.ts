import * as csvtojson from 'csvtojson';
import { config } from './../config';
import { BaseRepository } from '../repositories/sequelize/base';
import { IDietGroupRepository } from '../repositories/diet-group';
import { DietGroupRepository } from '../repositories/sequelize/diet-group';
import { DietGroup } from '../entities/diet-group';

async function importFormulas() {

    const applicationId: number = 1;

    const jsonObj: any[] = await getJSON('./src/importer/formulas.csv');

    const dietGroupRepository: DietGroupRepository = new DietGroupRepository(config.database.host, config.database.username, config.database.password);

    for (const obj of jsonObj) {

        let parentDietGroupId: number = null;
        let dietGroups: DietGroup[] = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);

        if (obj['Group 1']) {
            if (!dietGroups.find((x) => x.name === obj['Group 1'])) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, obj['Group 1'], null, parentDietGroupId? new DietGroup(parentDietGroupId, null, null, null) : null));

                parentDietGroupId  = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            }
        }

        if (obj['Group 2']) {
            if (!dietGroups.find((x) => x.name === obj['Group 2'])) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, obj['Group 2'], null, parentDietGroupId? new DietGroup(parentDietGroupId, null, null, null) : null));

                parentDietGroupId  = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            }
        }

        if (obj['Group 3']) {
            if (!dietGroups.find((x) => x.name === obj['Group 3'])) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, obj['Group 3'], null, parentDietGroupId? new DietGroup(parentDietGroupId, null, null, null) : null));

                parentDietGroupId  = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            }
        }

        if (obj['Group 4']) {
            if (!dietGroups.find((x) => x.name === obj['Group 4'])) {
                const result: DietGroup = await dietGroupRepository.create(applicationId, new DietGroup(null, obj['Group 4'], null, parentDietGroupId? new DietGroup(parentDietGroupId, null, null, null) : null));

                parentDietGroupId  = result.id;

                dietGroups = await dietGroupRepository.listSubGroups(applicationId, parentDietGroupId);
            }
        }
    }

    dietGroupRepository.close();
}

function getJSON(fileName: string): Promise<any[]> {
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

importFormulas();