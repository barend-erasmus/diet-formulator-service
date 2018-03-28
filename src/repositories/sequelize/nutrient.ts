import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';

import { Nutrient } from '../../entities/nutrient';
import { ICache } from '../../interfaces/cache';
import { ILogger } from '../../interfaces/logger';
import { INutrientRepository } from '../nutrient';
import { BaseRepository } from './base';

@injectable()
export class NutrientRepository extends BaseRepository implements INutrientRepository {

    constructor(
        host: string,
        userName: string,
        password: string,
        logger: ILogger,
        cache: ICache,
    ) {
        super(host, userName, password, logger, cache);
    }

    public async create(nutrient: Nutrient): Promise<Nutrient> {
        const result: any = await BaseRepository.models.Nutrient.create({
            abbreviation: nutrient.abbreviation,
            code: nutrient.code,
            description: nutrient.description,
            name: nutrient.name,
            sortOrder: nutrient.sortOrder,
            unit: nutrient.unit,
        });

        nutrient.id = result.id;

        return nutrient;
    }

    public async find(code: string): Promise<Nutrient> {
        const result: any = await BaseRepository.models.Nutrient.find({
            where: {
                code: {
                    [Sequelize.Op.eq]: code,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToNutrient(result);
    }

    public async findById(nutrientId: number): Promise<Nutrient> {
        const result: any = await BaseRepository.models.Nutrient.find({
            where: {
                id: {
                    [Sequelize.Op.eq]: nutrientId,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToNutrient(result);
    }

    public async list(): Promise<Nutrient[]> {
        const result: any[] = await BaseRepository.models.Nutrient.findAll({
            order: [
                ['sortOrder', 'ASC'],
            ],
        });

        return result.map((x) => this.mapToNutrient(x));
    }

    public async update(nutrient: Nutrient): Promise<Nutrient> {
        const result: any = await BaseRepository.models.Nutrient.find({
            where: {
                id: {
                    [Sequelize.Op.eq]: nutrient.id,
                },
            },
        });

        result.abbreviation = nutrient.abbreviation;
        result.code = nutrient.code;
        result.description = nutrient.description;
        result.name = nutrient.name;
        result.sortOrder = nutrient.sortOrder;
        result.unit = nutrient.unit;

        await result.save();

        return nutrient;
    }

}
