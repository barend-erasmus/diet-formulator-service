import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Nutrient } from '../entities/nutrient';
import { INutrientRepository } from '../repositories/nutrient';
import { IUserRepository } from '../repositories/user';
import { config } from './../config';
import { BaseService } from './base';

@injectable()
export class NutrientService extends BaseService {

    constructor(
        @inject("IUserRepository")
        userRepository: IUserRepository,
        @inject("INutrientRepository")
        private nutrientRepository: INutrientRepository,
    ) {
        super(userRepository);
    }

    public async create(
        nutrient: Nutrient,
        username: string,
    ): Promise<Nutrient> {

        if (!await this.hasPermission(username, 'create-nutrient')) {
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
        username: string,
    ): Promise<Nutrient> {

        if (!await this.hasPermission(username, 'view-nutrient')) {
            throw new Error('Unauthorized');
        }

        return this.nutrientRepository.findById(nutrientId);
    }

    public async list(
        username: string,
    ): Promise<Nutrient[]> {

        if (!await this.hasPermission(username, 'view-nutrient')) {
            throw new Error('Unauthorized');
        }

        return this.nutrientRepository.list();
    }

    public async update(
        nutrient: Nutrient,
        username: string,
    ): Promise<Nutrient> {

        if (!await this.hasPermission(username, 'update-nutrient')) {
            throw new Error('Unauthorized');
        }

        nutrient.validate();

        return this.nutrientRepository.update(nutrient);
    }
}
