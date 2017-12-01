import { config } from './../config';
import { IApplicationRepository } from '../repositories/application';
import { Application } from '../entities/application';

export class ApplicationService {

    constructor(
        private applicationRepository: IApplicationRepository,
    ) {

    }

    public async create(
        name: string,
        description: string,
    ): Promise<Application> {
        return this.applicationRepository.create(name, description);
    }   
}
