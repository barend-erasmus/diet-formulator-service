import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { Diet } from '../../entities/diet';
import { DietGroup } from '../../entities/diet-group';
import { DietValue } from '../../entities/diet-value';
import { Nutrient } from '../../entities/nutrient';
import { IDietRepository } from '../diet';
import { BaseRepository } from './base';

@injectable()
export class DietRepository extends BaseRepository implements IDietRepository {
    constructor(host: string, userName: string, password: string) {
        super(host, userName, password);
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

        let dietGroup: DietGroup = new DietGroup(result.dietGroup.id, result.dietGroup.name, result.dietGroup.description, result.dietGroup.dietGroupId ? new DietGroup(result.dietGroup.dietGroupId, null, null, null) : null);

        dietGroup = await this.loadDietGroupParent(dietGroup);

        return new Diet(result.id, result.name, result.description, result.userName, dietGroup,
            result.dietValues.map((value) =>
                new DietValue(value.id, value.minimum, value.maximum, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder)),
            ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder));
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

        return result.map((x) => new Diet(x.id, x.name, x.description, x.userName, new DietGroup(x.dietGroup.id, x.dietGroup.name, x.dietGroup.description, null), []));
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

    private async loadDietGroupParent(dietGroup: DietGroup): Promise<DietGroup> {

        if (dietGroup.parent) {

            const result: any = await BaseRepository.models.DietGroup.find({
                where: {
                    id: {
                        [Sequelize.Op.eq]: dietGroup.parent.id,
                    },
                },
            });

            const parent: DietGroup = new DietGroup(result.id, result.name, result.description, result.dietGroupId ? new DietGroup(result.dietGroupId, null, null, null) : null);

            dietGroup.parent = await this.loadDietGroupParent(parent);
        }

        return dietGroup;
    }
}
