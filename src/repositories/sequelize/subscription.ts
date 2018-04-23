import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';

import { ILogger } from 'majuro';
import { Subscription } from '../../entities/subscription';
import { ICache } from '../../interfaces/cache';
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
        logger: ILogger,
        cache: ICache,
    ) {
        super(host, userName, password, logger, cache);
    }

    public async create(subscription: Subscription, userName: string): Promise<Subscription> {
        const result: any = await BaseRepository.models.Subscription.create({
            active: subscription.active,
            endTimestamp: subscription.endTimestamp ? subscription.endTimestamp.getTime() : null,
            startTimestamp: subscription.startTimestamp.getTime(),
            token: subscription.token,
            type: subscription.toString(),
            userName,
        });

        subscription.id = result.id;

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

        return this.subscriptionFactory.create(
            result.active,
            result.endTimestamp ? new Date(parseInt(result.endTimestamp, undefined)) : null,
            result.id,
            new Date(parseInt(result.startTimestamp, undefined)),
            result.token,
            result.type,
        );
    }

    public async findById(subscriptionId: number): Promise<Subscription> {
        const result: any = await BaseRepository.models.Subscription.find({
            where: {
                id: {
                    [Sequelize.Op.eq]: subscriptionId,
                },
            },
        });

        if (!result) {
            return null;
        }

        return this.subscriptionFactory.create(
            result.active,
            result.endTimestamp ? new Date(parseInt(result.endTimestamp, undefined)) : null,
            result.id,
            new Date(parseInt(result.startTimestamp, undefined)),
            result.token,
            result.type,
        );
    }

    public async update(subscription: Subscription, userName: string): Promise<Subscription> {
        const result: any = await BaseRepository.models.Subscription.find({
            where: {
                id: {
                    [Sequelize.Op.eq]: subscription.id,
                },
            },
        });

        result.active = subscription.active;
        result.endTimestamp = subscription.endTimestamp ? subscription.endTimestamp.getTime() : null;
        result.token = subscription.token;

        await result.save();

        return subscription;
    }

}
