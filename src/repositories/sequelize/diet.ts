import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { IDietRepository } from '../diet';
import { Diet } from '../../entities/diet';
import { DietGroup } from '../../entities/diet-group';

export class DietRepository extends BaseRepository implements IDietRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(diet: Diet): Promise<Diet> {

        const result: any = await BaseRepository.models.Diet.create({
            description: diet.description,
            dietGroupId: diet.group.id,
            name: diet.name,
            username: diet.username,
            dietValues: diet.values.map((value) => {
                return {
                    maximum: value.maximum,
                    minimum: value.minimum,
                    nutrientId: value.nutrient.id,
                };
            }),
        }, {

                include: [
                    {
                        model: BaseRepository.models.DietValue,
                    },
                ],
            });

        diet.id = result.id;

        return diet;
    }

    public async list(dietGroupId: number): Promise<Diet[]> {

        const result: any[] = await BaseRepository.models.Diet.findAll({
            include: [
                {
                    model: BaseRepository.models.DietGroup,
                }
            ],
            order: [
                ['name', 'ASC'],
            ],
            where: {
                dietGroupId: {
                    [Sequelize.Op.eq]: dietGroupId,
                },
            },
        });

        return result.map((x) => new Diet(x.id, x.name, x.description, x.username, new DietGroup(x.dietGroup.id, x.dietGroup.name, x.dietGroup.description, null), null));
    }
}
