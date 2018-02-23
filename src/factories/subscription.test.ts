import { expect } from 'chai';
import 'mocha';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { SubscriptionFactory } from './subscription';
import { Subscription } from '../entities/subscription';

describe('SubscriptionFactory', () => {

    let subscriptionFactory: ISubscriptionFactory = null;

    before(async () => {
        subscriptionFactory = new SubscriptionFactory();
    });

    describe('create', () => {

        it('should return subscription', async () => {

            const result: Subscription = subscriptionFactory.create(true, new Date(), new Date(), 'trial');

            expect(result).to.be.not.null;
            
        });

        it('should return subscription with expired false given expiry timestamp has not past', async () => {

            const result: Subscription = subscriptionFactory.create(true, new Date(2070, 0, 0), new Date(2002, 0, 0), 'trial');

            expect(result.expired).to.be.false;
            
        });

        it('should return subscription with expired true given expiry timestamp has past', async () => {

            const result: Subscription = subscriptionFactory.create(true, new Date(2010, 0, 0), new Date(2009, 0, 0), 'trial');

            expect(result.expired).to.be.true;
            
        });

    });
});
