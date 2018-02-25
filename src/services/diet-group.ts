import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { EventBus } from '../bus/event';
import { DietGroup } from '../entities/diet-group';
import { DietGroupEvent } from '../events/diet-group';
import { DietGroupCreatedEvent } from '../events/diet-group-created';
import { DietGroupUpdatedEvent } from '../events/diet-group-updated';
import { IDietGroupRepository } from '../repositories/diet-group';
import { BaseService } from './base';

@injectable()
export class DietGroupService extends BaseService {

    constructor(
        @inject('DietGroupEventBus')
        private dietGroupEventBus: EventBus<DietGroupEvent>,
        @inject('IDietGroupRepository')
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super();
    }

    public async create(
        dietGroup: DietGroup,
        userName: string,
    ): Promise<DietGroup> {
        await this.throwIfDoesNotHavePermission(userName, 'create-diet-group');

        dietGroup.validate();

        let result: DietGroup = await this.dietGroupRepository.create(dietGroup);

        await this.dietGroupEventBus.publish(new DietGroupCreatedEvent(userName));

        result = await this.cleanDietGroup(result, userName);

        return result;
    }

    public async find(
        dietGroupId: number,
        userName: string,
    ): Promise<DietGroup> {
        await this.throwIfDoesNotHavePermission(userName, 'view-diet-group');

        let result: DietGroup = await this.dietGroupRepository.find(dietGroupId);

        result = await this.cleanDietGroup(result, userName);

        return result;
    }

    public async list(
        dietGroupId: number,
        userName: string,
    ): Promise<DietGroup[]> {
        await this.throwIfDoesNotHavePermission(userName, 'view-diet-group');

        let result: DietGroup[] = await this.dietGroupRepository.listSubGroups(dietGroupId);

        result = await this.cleanList<DietGroup>(result, userName, this.cleanDietGroup);

        return result;
    }

    public async listAll(
        userName: string,
    ): Promise<DietGroup[]> {
        await this.throwIfDoesNotHavePermission(userName, 'view-diet-group');

        let result: DietGroup[] = await this.dietGroupRepository.list();

        result = await this.cleanList<DietGroup>(result, userName, this.cleanDietGroup);

        return result;
    }

    public async update(
        dietGroup: DietGroup,
        userName: string,
    ): Promise<DietGroup> {
        await this.throwIfDoesNotHavePermission(userName, 'update-diet-group');

        dietGroup.validate();

        let result: DietGroup = await this.dietGroupRepository.update(dietGroup);

        await this.dietGroupEventBus.publish(new DietGroupUpdatedEvent(userName));

        result = await this.cleanDietGroup(result, userName);

        return result;
    }

}
