import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { INutrientRepository } from '../nutrient';
import { Nutrient } from '../../entities/nutrient';
import { reset } from 'continuation-local-storage';

export class NutrientRepository extends BaseRepository implements INutrientRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(applicationId: number, nutrient: Nutrient): Promise<Nutrient> {

        const result: any = await BaseRepository.models.Nutrient.create({
            abbreviation: nutrient.abbreviation,
            applicationId: applicationId,
            code: nutrient.code,
            description: nutrient.description,
            name: nutrient.name,
            sortOrder: nutrient.sortOrder,
            unit: nutrient.unit,
        });

        nutrient.id = result.id;

        return nutrient;
    }

    public async find(applicationId: number, code: string): Promise<Nutrient> {

        const result: any = await BaseRepository.models.Nutrient.find({
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
                code: {
                    [Sequelize.Op.eq]: code,
                },
            },
        });

        return new Nutrient(result.id, result.name, result.description, result.code, result.abbreviation, result.unit, result.sortOrder);
    }

    public async findById(applicationId: number, nutrientId: number): Promise<Nutrient> {

        const result: any = await BaseRepository.models.Nutrient.find({
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
                id: {
                    [Sequelize.Op.eq]: nutrientId,
                },
            },
        });

        return new Nutrient(result.id, result.name, result.description, result.code, result.abbreviation, result.unit, result.sortOrder);
    }

    public async list(applicationId: number): Promise<Nutrient[]> {

        const result: any[] = await BaseRepository.models.Nutrient.findAll({
            order: [
                ['sortOrder', 'ASC'],
            ],
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
            },
        });

        return result.map((x) => new Nutrient(x.id, x.name, x.description, x.code, x.abbreviation, x.unit, x.sortOrder));
    }

    public async update(applicationId: number, nutrient: Nutrient): Promise<Nutrient> {

        const result: any = await BaseRepository.models.Nutrient.find({
            where: {
                applicationId: {
                    [Sequelize.Op.eq]: applicationId,
                },
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
