import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as uuid from 'uuid';
import { Payment } from '../entities/payment';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';
import { ISubscriptionGateway } from '../interfaces/subscription-gateway';

@injectable()
export class PayFastSubscriptionGateway implements ISubscriptionGateway {

    private sandbox: boolean = true;

    constructor(
        private merchantId: string,
        private merchantSecret: string,
        private passPhrase: string,
    ) {

    }

    public async cancel(subscriptionId: string): Promise<boolean> {
        return true;
    }

    public async createRedirectURI(amount: number, subscription: Subscription, user: User): Promise<string> {

        const params: any = {
            amount: this.sandbox ? '5' : amount.toString(),
            cancel_url: `https://suite.worldofrations.com/billing?subscriptionId=${subscription.id}`,
            cycles: 0,
            email_address: user.email,
            frequency: 3,
            item_description: `${subscription.type.toUpperCase()} Subscription`,
            item_name: 'World of Rations Suite Subscription',
            m_payment_id: subscription.id,
            merchant_id: this.merchantId,
            merchant_key: this.merchantSecret,
            name_first: user.displayName,
            notify_url: 'https://api.suite.worldofrations.com/api/payment/notify',
            payment_method: 'cc',
            return_url: `https://suite.worldofrations.com/billing?subscriptionId=${subscription.id}`,
            subscription_type: 1,
        };

        const sortedKeys: string[] = Object.keys(params);

        return `https://www.payfast.co.za/eng/process?${sortedKeys.map((key) => `${key}=${params[key]}`).join('&')}`;
    }

    public async notify(subscriptionId: string): Promise<boolean> {
        return true;
    }
}
