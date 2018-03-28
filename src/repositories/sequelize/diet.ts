import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';

import { Diet } from '../../entities/diet';
import { DietGroup } from '../../entities/diet-group';
import { DietValue } from '../../entities/diet-value';
import { Nutrient } from '../../entities/nutrient';
import { ICache } from '../../interfaces/cache';
import { ILogger } from '../../interfaces/logger';
import { IDietRepository } from '../diet';
import { BaseRepository } from './base';

@injectable()
export class DietRepository extends BaseRepository implements IDietRepository {

    constructor(
        host: string,
        userName: string,
        password: string,
        logger: ILogger,
        cache: ICache,
    ) {
        super(host, userName, password, logger, cache);
    }

    public async create(diet: Diet): Promise<Diet> {
        const result: any = await BaseRepository.models.Diet.create({
            description: diet.description,
            dietGroupId: diet.group.id,
            dietValues: diet.values.map((value) => {
                return {
                    maximum: value.maximum,
                    minimum: value.minimum,
                    nutrientId: value.nutrient.id,
                };
            }),
            name: diet.name,
            userName: diet.userName,
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

    public async find(dietId: number): Promise<Diet> {
        const result: any = await BaseRepository.models.Diet.find({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.Nutrient,
                        },
                    ],
                    model: BaseRepository.models.DietValue,
                },
                {
                    model: BaseRepository.models.DietGroup,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: dietId,
                },
            },
        });

        if (!result) {
            return null;
        }

        let dietGroup: DietGroup = this.mapToDietGroup(result.dietGroup);

        dietGroup = await this.loadDietGroupParent(dietGroup);

        return this.mapToDiet(result, dietGroup);
    }

    public async findComparison(dietId: number): Promise<Diet> {
        const result: any = await BaseRepository.models.ComparisonDiet.find({
            where: {
                dietId: {
                    [Sequelize.Op.eq]: dietId,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.find(result.comparisonDietId);
    }

    public async list(dietGroupId: number, userName: string): Promise<Diet[]> {
        const result: any[] = await BaseRepository.models.Diet.findAll({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.Nutrient,
                        },
                    ],
                    model: BaseRepository.models.DietValue,
                },
                {
                    model: BaseRepository.models.DietGroup,
                },
            ],
            order: [
                ['name', 'ASC'],
            ],
            where: {
                dietGroupId: {
                    [Sequelize.Op.eq]: dietGroupId,
                },
                userName: {
                    [Sequelize.Op.or]: [null, userName],
                },
            },
        });

        const diets: Diet[] = result.map((x) => this.mapToDiet(x, this.mapToDietGroup(x.dietGroup)));

        for (const diet of diets) {
            diet.group = await this.loadDietGroupParent(diet.group);
        }

        return diets;
    }

    public async update(diet: Diet): Promise<Diet> {
        const result: any = await BaseRepository.models.Diet.find({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.Nutrient,
                        },
                    ],
                    model: BaseRepository.models.DietValue,
                },
                {
                    model: BaseRepository.models.DietGroup,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: diet.id,
                },
            },
        });

        result.description = diet.description;
        result.name = diet.name;

        for (const value of diet.values) {
            const dietValue = result.dietValues.find((x) => x.nutrient.id === value.nutrient.id);

            if (dietValue && (value.minimum !== null || value.maximum !== null)) {
                dietValue.minimum = value.minimum;
                dietValue.maximum = value.maximum;
                await dietValue.save();
            } else if (value.minimum !== null || value.maximum !== null) {
                await BaseRepository.models.DietValue.create({
                    dietId: result.id,
                    maximum: value.maximum,
                    minimum: value.minimum,
                    nutrientId: value.nutrient.id,
                });
            } else if (dietValue) {
                await BaseRepository.models.DietValue.destroy({
                    where: {
                        id: {
                            [Sequelize.Op.eq]: value.id,
                        },
                    },
                });
            }
        }

        await result.save();

        return diet;
    }

}
