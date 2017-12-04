import { Diet } from '../entities/diet';
import { IDietRepository } from '../repositories/diet';
import { config } from './../config';

export class DietService {

    constructor(
        private dietRepository: IDietRepository,
    ) {

    }

    public async create(
        diet: Diet,
    ): Promise<Diet> {

        diet.validate();
        
        return this.dietRepository.create(diet);
    }

    public async find(
        dietId: number,
    ): Promise<Diet> {
        return this.dietRepository.find(dietId);
    }

    public async list(
        dietGroupId: number,
    ): Promise<Diet[]> {
        return this.dietRepository.list(dietGroupId);
    }

}
