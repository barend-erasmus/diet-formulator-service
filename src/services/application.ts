import { Application } from '../entities/application';
import { IApplicationRepository } from '../repositories/application';
import { IUserRepository } from '../repositories/user';
import { config } from './../config';
import { BaseService } from './base';

export class ApplicationService extends BaseService {

    constructor(
        userRepository: IUserRepository,
        private applicationRepository: IApplicationRepository,
    ) {
        super(userRepository);
    }

    public async create(
        name: string,
        description: string,
        username: string,
    ): Promise<Application> {

        if (!await this.hasPermission(username, 'create-application')) {
            throw new Error('Unauthorized');
        }

        return this.applicationRepository.create(name, description);
    }
}
