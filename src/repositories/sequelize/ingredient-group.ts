import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { IIngredientGroupRepository } from '../ingredient-group';
import { IngredientGroup } from '../../entities/ingredient-group';

export class IngredientGroupRepository extends BaseRepository implements IIngredientGroupRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(applicationId: number, ingredientGroup: IngredientGroup): Promise<IngredientGroup> {

        const result: any = await BaseRepository.models.IngredientGroup.create({
            applicationId: applicationId,
            description: ingredientGroup.description,
            name: ingredientGroup.name,
        });

        ingredientGroup.id = result.id;

        return ingredientGroup;
    }

    public async list(applicationId: number): Promise<IngredientGroup[]> {

        const result: any[] = await BaseRepository.models.IngredientGroup.findAll({
            order: [
                ['name', 'ASC'],
            ],
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
            },
        });

        return result.map((x) => new IngredientGroup(x.id, x.name, x.description));
    }
}
