import * as Sequelize from 'sequelize';
import { DietGroup } from "../../entities/diet-group";
import { IDietGroupRepository } from "../diet-group";
import { BaseRepository } from "./base";

export class DietGroupRepository extends BaseRepository implements IDietGroupRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(applicationId: number, dietGroup: DietGroup): Promise<DietGroup> {
        const result: any = await BaseRepository.models.DietGroup.create({
            applicationId,
            description: dietGroup.description,
            dietGroupId: dietGroup.parent ? dietGroup.parent.id : null,
            name: dietGroup.name,
        });

        dietGroup.id = result.id;

        return dietGroup;
    }

    public async find(applicationId: number, dietGroupId: number): Promise<DietGroup> {

        const result: any = await BaseRepository.models.DietGroup.find({
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
                id: {
                    [Sequelize.Op.eq]: dietGroupId,
                },
            },
        });

        if (!result) {
            return null;
        }

        let dietGroup: DietGroup = new DietGroup(result.id, result.name, result.description, result.dietGroupId ? new DietGroup(result.dietGroupId, null, null, null) : null);

        dietGroup = await this.loadDietGroupParent(applicationId, dietGroup);

        return dietGroup;
    }

    public async list(applicationId: number): Promise<DietGroup[]> {
        const result: any[] = await BaseRepository.models.DietGroup.findAll({
            order: [
                ['name', 'ASC'],
            ],
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
            },
        });

        const dietGroups: DietGroup[] = result.map((x) => new DietGroup(x.id, x.name, x.description, x.dietGroupId ? new DietGroup(x.dietGroupId, null, null, null) : null));

        for (const item of dietGroups) {
            await this.loadDietGroupParent(applicationId, item);
        }

        return dietGroups;
    }

    public async listSubGroups(applicationId: number, dietGroupId: number): Promise<DietGroup[]> {
        const result: any[] = await BaseRepository.models.DietGroup.findAll({
            order: [
                ['name', 'ASC'],
            ],
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
                dietGroupId: {
                    [Sequelize.Op.eq]: dietGroupId,
                },
            },
        });

        const dietGroups: DietGroup[] = result.map((x) => new DietGroup(x.id, x.name, x.description, x.dietGroupId ? new DietGroup(x.dietGroupId, null, null, null) : null));

        for (const item of dietGroups) {
            await this.loadDietGroupParent(applicationId, item);
        }

        return dietGroups;
    }

    public async update(applicationId: number, dietGroup: DietGroup): Promise<DietGroup> {

        const result: any = await BaseRepository.models.DietGroup.find({
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
                id: {
                    [Sequelize.Op.eq]: dietGroup.id,
                },
            },
        });

        result.description = dietGroup.description;
        result.name = dietGroup.name;
        result.dietGroupId = dietGroup.parent ? dietGroup.parent.id : null;

        await result.save();

        return dietGroup;
    }

    private async loadDietGroupParent(applicationId: number, dietGroup: DietGroup): Promise<DietGroup> {
        if (dietGroup.parent) {
            const parent: DietGroup = await this.find(applicationId, dietGroup.parent.id);
            dietGroup.parent = parent;
        }

        return dietGroup;
    }
}
