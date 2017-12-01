import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { IDietGroupRepository } from "../diet-group";
import { DietGroup } from "../../entities/diet-group";

export class DietGroupRepository extends BaseRepository implements IDietGroupRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(applicationId: number, dietGroup: DietGroup): Promise<DietGroup> {

        const result: any = await BaseRepository.models.DietGroup.create({
            applicationId: applicationId,
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
                dietGroupId: {
                    [Sequelize.Op.eq]: null,
                },
            },
        });

        return new DietGroup(result.id, result.name, result.description, null);
    }

    public async list(applicationId: number): Promise<DietGroup[]> {

        const result: any[] = await BaseRepository.models.DietGroup.findAll({
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
                dietGroupId: {
                    [Sequelize.Op.eq]: null,
                },
            },
        });

        return result.map((x) => new DietGroup(x.id, x.name, x.description, null));
    }

    public async listSubGroups(applicationId: number, dietGroupId: number): Promise<DietGroup[]> {

        const result: any[] = await BaseRepository.models.DietGroup.findAll({
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
                dietGroupId: {
                    [Sequelize.Op.eq]: dietGroupId,
                },
            },
        });

        return result.map((x) => new DietGroup(x.id, x.name, x.description, null));
    }
}
