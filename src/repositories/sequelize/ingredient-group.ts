import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { IngredientGroup } from '../../entities/ingredient-group';
import { IIngredientGroupRepository } from '../ingredient-group';
import { BaseRepository } from './base';

@injectable()
export class IngredientGroupRepository extends BaseRepository implements IIngredientGroupRepository {

    constructor(host: string, userName: string, password: string) {
        super(host, userName, password);
    }

    public async create(ingredientGroup: IngredientGroup): Promise<IngredientGroup> {

        const result: any = await BaseRepository.models.IngredientGroup.create({
            description: ingredientGroup.description,
            name: ingredientGroup.name,
        });

        ingredientGroup.id = result.id;

        return ingredientGroup;
    }

    public async list(): Promise<IngredientGroup[]> {

        const result: any[] = await BaseRepository.models.IngredientGroup.findAll({
            order: [
                ['name', 'ASC'],
            ],
        });

        return result.map((x) => new IngredientGroup(x.id, x.name, x.description));
    }
}
