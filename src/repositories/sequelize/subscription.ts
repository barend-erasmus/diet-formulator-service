import { inject, injectable } from 'inversify';
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
            expiryTimestamp: subscription.expiryTimestamp.getTime(),
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
                // expiryTimestamp: {
                //     [Sequelize.Op.lt]: new Date().getTime(),
                // },
                // startTimestamp: {
                //     [Sequelize.Op.gte]: new Date().getTime(),
                // },
                userName: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.subscriptionFactory.create(result.active, new Date(result.expiryTimestamp), new Date(result.startTimestamp), result.type);
    }
}
