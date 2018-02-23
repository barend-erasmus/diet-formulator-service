import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DietGroup } from '../entities/diet-group';
import { IDietGroupRepository } from '../repositories/diet-group';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';
import { DietGroupEvent } from '../events/diet-group';
import { EventBus } from '../bus/event';
import { DietGroupUpdatedEvent } from '../events/diet-group-updated';
import { DietGroupCreatedEvent } from '../events/diet-group-created';

@injectable()
export class DietGroupService extends BaseService {

    constructor(
        @inject('DietGroupEventBus')
        private dietGroupEventBus: EventBus<DietGroupEvent>,
        @inject('ISubscriptionRepository')
        subscriptionRepository: ISubscriptionRepository,
        @inject('IUserRepository')
        userRepository: IUserRepository,
        @inject('IDietGroupRepository')
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super(subscriptionRepository, userRepository);
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
