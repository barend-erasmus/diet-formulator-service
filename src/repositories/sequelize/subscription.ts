import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { Subscription } from '../../entities/subscription';
import { ISubscriptionFactory } from '../../interfaces/subscription-factory';
import { ISubscriptionRepository } from '../subscription';
import { BaseRepository } from './base';

@injectable()
export class SubscriptionRepository extends BaseRepository implements ISubscriptionRepository {

    constructor(
        private subscriptionFactory: ISubscriptionFactory,
        host: string,
        userName: string,
        password: string,
    ) {
        super(host, userName, password);
    }

    public async create(subscription: Subscription, userName: string): Promise<Subscription> {
        const result: any = await BaseRepository.models.Subscription.create({
            active: subscription.active,
            expiryTimestamp: subscription.expiryTimestamp ? subscription.expiryTimestamp.getTime() : null,
            startTimestamp: subscription.startTimestamp.getTime(),
            type: subscription.type,
            userName,
        });

        return subscription;
    }

    public async find(userName: string): Promise<Subscription> {
        const result: any = await BaseRepository.models.Subscription.find({
            where: {
                active: {
                    [Sequelize.Op.eq]: true,
                },
                userName: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.subscriptionFactory.create(result.active, new Date(parseInt(result.expiryTimestamp, undefined)), new Date(parseInt(result.startTimestamp, undefined)), result.type);
    }

    public async update(subscription: Subscription, userName: string): Promise<Subscription> {
        const result: any = await BaseRepository.models.Subscription.find({
            where: {
                active: {
                    [Sequelize.Op.eq]: true,
                },
                userName: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        result.active = subscription.active;

        await result.save();

        return subscription;
    }
}
