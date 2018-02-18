import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { DietGroup } from '../../entities/diet-group';
import { IDietGroupRepository } from '../diet-group';
import { BaseRepository } from './base';

@injectable()
export class DietGroupRepository extends BaseRepository implements IDietGroupRepository {

    constructor(host: string, userName: string, password: string) {
        super(host, userName, password);
    }

    public async create(dietGroup: DietGroup): Promise<DietGroup> {
        const result: any = await BaseRepository.models.DietGroup.create({
            description: dietGroup.description,
            dietGroupId: dietGroup.parent ? dietGroup.parent.id : null,
            name: dietGroup.name,
        });

        dietGroup.id = result.id;

        return dietGroup;
    }

    public async find(dietGroupId: number): Promise<DietGroup> {

        const result: any = await BaseRepository.models.DietGroup.find({
            where: {
                id: {
                    [Sequelize.Op.eq]: dietGroupId,
                },
            },
        });

        if (!result) {
            return null;
        }

        let dietGroup: DietGroup = new DietGroup(
            result.id,
            result.name,
            result.description,
            result.dietGroupId ? new DietGroup(result.dietGroupId, null, null, null) : null,
        );

        dietGroup = await this.loadDietGroupParent(dietGroup);

        return dietGroup;
    }

    public async list(): Promise<DietGroup[]> {
        const result: any[] = await BaseRepository.models.DietGroup.findAll({
            order: [
                ['name', 'ASC'],
            ],
        });

        const dietGroups: DietGroup[] = result.map((x) => new DietGroup(
            x.id,
            x.name,
            x.description,
            x.dietGroupId ? new DietGroup(x.dietGroupId, null, null, null) : null,
        ));

        for (const item of dietGroups) {
            await this.loadDietGroupParent(item);
        }

        return dietGroups;
    }

    public async listSubGroups(dietGroupId: number): Promise<DietGroup[]> {
        const result: any[] = await BaseRepository.models.DietGroup.findAll({
            order: [
                ['name', 'ASC'],
            ],
            where: {
                dietGroupId: {
                    [Sequelize.Op.eq]: dietGroupId,
                },
            },
        });

        const dietGroups: DietGroup[] = result.map((x) => new DietGroup(
            x.id,
            x.name,
            x.description,
            x.dietGroupId ? new DietGroup(x.dietGroupId, null, null, null) : null,
        ));

        for (const item of dietGroups) {
            await this.loadDietGroupParent(item);
        }

        return dietGroups;
    }

    public async update(dietGroup: DietGroup): Promise<DietGroup> {

        const result: any = await BaseRepository.models.DietGroup.find({
            where: {
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
}
