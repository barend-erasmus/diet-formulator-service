import { Application } from "../entities/application";

export interface IApplicationRepository {
    create(name: string, description: string): Promise<Application>;
}