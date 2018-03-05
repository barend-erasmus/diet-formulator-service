import { expect } from 'chai';
import 'mocha';
import { Subscription } from '../entities/subscription';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { SubscriptionFactory } from './subscription';

describe('SubscriptionFactory', () => {

    let subscriptionFactory: ISubscriptionFactory = null;

    before(async () => {
        subscriptionFactory = new SubscriptionFactory();
    });

    describe('create', () => {

        it('should return subscription', async () => {

            const result: Subscription = subscriptionFactory.create(true, new Date(), null, new Date(), 'trial');

            expect(result).to.be.not.null;

        });

    });
});
