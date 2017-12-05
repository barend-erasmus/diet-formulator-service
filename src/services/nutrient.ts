import { Nutrient } from '../entities/nutrient';
import { INutrientRepository } from '../repositories/nutrient';
import { config } from './../config';
import { BaseService } from './base';

export class NutrientService extends BaseService {

    constructor(
        private nutrientRepository: INutrientRepository,
    ) {
        super();
    }

    public async create(
        applicationId: number,
        nutrient: Nutrient,
        username: string,
    ): Promise<Nutrient> {

        if (!this.hasPermission(username, 'create-nutrient')) {
            throw new Error('Unauthorized');
        }

        nutrient.validate();

        const existingNutrient: Nutrient = await this.nutrientRepository.find(applicationId, nutrient.code);

        if (existingNutrient) {
            throw new Error(`Nutrient with code '${nutrient.code}' already exist`);
        }

        return this.nutrientRepository.create(applicationId, nutrient);
    }

    public async find(
        applicationId: number,
        nutrientId: number,
        username: string,
    ): Promise<Nutrient> {

        if (!this.hasPermission(username, 'view-nutrient')) {
            throw new Error('Unauthorized');
        }

        return this.nutrientRepository.findById(applicationId, nutrientId);
    }

    public async list(
        applicationId: number,
        username: string,
    ): Promise<Nutrient[]> {

        if (!this.hasPermission(username, 'view-nutrient')) {
            throw new Error('Unauthorized');
        }

        return this.nutrientRepository.list(applicationId);
    }

    public async update(
        applicationId: number,
        nutrient: Nutrient,
        username: string,
    ): Promise<Nutrient> {

        if (!this.hasPermission(username, 'update-nutrient')) {
            throw new Error('Unauthorized');
        }

        nutrient.validate();

        return this.nutrientRepository.update(applicationId, nutrient);
    }
}
