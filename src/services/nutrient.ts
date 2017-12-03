import { Nutrient } from '../entities/nutrient';
import { INutrientRepository } from '../repositories/nutrient';
import { config } from './../config';

export class NutrientService {

    constructor(
        private nutrientRepository: INutrientRepository,
    ) {

    }

    public async create(
        applicationId: number,
        nutrient: Nutrient,
    ): Promise<Nutrient> {

        nutrient.validate();

        return this.nutrientRepository.create(applicationId, nutrient);
    }

    public async find(
        applicationId: number,
        nutrientId: number,
    ): Promise<Nutrient> {
        return this.nutrientRepository.findById(applicationId, nutrientId);
    }

    public async list(
        applicationId: number,
    ): Promise<Nutrient[]> {
        return this.nutrientRepository.list(applicationId);
    }

    public async update(
        applicationId: number,
        nutrient: Nutrient,
    ): Promise<Nutrient> {

        nutrient.validate();

        return this.nutrientRepository.update(applicationId, nutrient);
    }
}
