import { Application } from '../entities/application';
import { IApplicationRepository } from '../repositories/application';
import { config } from './../config';

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
