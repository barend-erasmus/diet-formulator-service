import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { Nutrient } from '../entities/nutrient';
import { INutrientRepository } from '../repositories/nutrient';
import { BaseService } from './base';

@injectable()
export class NutrientService extends BaseService {

    constructor(
        @inject('INutrientRepository')
        private nutrientRepository: INutrientRepository,
    ) {
        super();
    }

    public async create(
        nutrient: Nutrient,
        userName: string,
    ): Promise<Nutrient> {
        if (!await this.hasPermission(userName, 'create-nutrient')) {
            throw new Error('Unauthorized');
        }

        nutrient.validate();

        const existingNutrient: Nutrient = await this.nutrientRepository.find(nutrient.code);

        if (existingNutrient) {
            throw new Error(`Nutrient with code '${nutrient.code}' already exist`);
        }

        return this.nutrientRepository.create(nutrient);
    }

    public async find(
        nutrientId: number,
        userName: string,
    ): Promise<Nutrient> {
        if (!await this.hasPermission(userName, 'view-nutrient')) {
            throw new Error('Unauthorized');
        }

        return this.nutrientRepository.findById(nutrientId);
    }

    public async list(
        userName: string,
    ): Promise<Nutrient[]> {
        if (!await this.hasPermission(userName, 'view-nutrient')) {
            throw new Error('Unauthorized');
        }

        return this.nutrientRepository.list();
    }

    public async update(
        nutrient: Nutrient,
        userName: string,
    ): Promise<Nutrient> {
        if (!await this.hasPermission(userName, 'update-nutrient')) {
            throw new Error('Unauthorized');
        }

        nutrient.validate();

        return this.nutrientRepository.update(nutrient);
    }

}
