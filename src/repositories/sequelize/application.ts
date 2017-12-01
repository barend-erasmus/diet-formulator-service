import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { IApplicationRepository } from '../application';
import { Application } from '../../entities/application';

export class ApplicationRepository extends BaseRepository implements IApplicationRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(name: string, description: string): Promise<Application> {

        const result: any = await BaseRepository.models.Application.create({
            description,
            name,
        });

        return new Application(result.id, name, description);
    }
}
