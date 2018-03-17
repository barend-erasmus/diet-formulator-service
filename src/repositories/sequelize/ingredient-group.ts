import { injectable } from 'inversify';
import 'reflect-metadata';

import { IngredientGroup } from '../../entities/ingredient-group';
import { ICache } from '../../interfaces/cache';
import { ILogger } from '../../interfaces/logger';
import { IIngredientGroupRepository } from '../ingredient-group';
import { BaseRepository } from './base';

@injectable()
export class IngredientGroupRepository extends BaseRepository implements IIngredientGroupRepository {

    constructor(
        host: string,
        userName: string,
        password: string,
        logger: ILogger,
        cache: ICache,
    ) {
        super(host, userName, password, logger, cache);
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

        return result.map((x) => this.mapToIngredientGroup(x));
    }
}
