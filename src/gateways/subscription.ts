import * as crypto from 'crypto';
import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import * as request from 'request-promise';
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
        const token: string = '';

        const params = {
            'merchant-id': this.merchantId,
            'passphrase': this.merchantSecret,
            'timestamp': moment().format('YYYY-MM-DDTHH:mm:ss[+02:00]'),
            'version': 'v1',
        };

        const keys = Object.keys(params).sort();

        const result = keys.map((key) => `${key}=${encodeURIComponent(params[key].replace(new RegExp('\\\\', 'g'), ''))}`).join('&');

        const signature = crypto.createHash('md5').update(result).digest('hex');

        const response = await request({
            headers: {
                'accept': 'application/json',
                'merchant-id': params['merchant-id'],
                'signature': signature,
                'timestamp': params['timestamp'],
                'version': params['version'],
            },
            json: true,
            method: 'PUT',
            uri: `https://api.payfast.co.za/subscriptions/${token}/cancel`,
        });

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
