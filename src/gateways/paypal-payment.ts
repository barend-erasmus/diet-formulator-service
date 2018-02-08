import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as request from 'request-promise';
import * as yargs from 'yargs';
import { Payment } from '../entities/payment';
import { ILogger } from '../interfaces/logger';
import { IPaymentGateway } from '../interfaces/payment-gateway';

@injectable()
export class PayPalPaymentGateway implements IPaymentGateway {

    private baseUri: string = 'https://api.sandbox.paypal.com/v1';

    private static accessToken: string = null;

    constructor(
        private clientId: string,
        private clientSecret: string,
        @inject('ILogger')
        private logger: ILogger,
    ) {

    }

    public async create(payment: Payment): Promise<Payment> {

        const accessToken: string = await this.getAccessToken();

        const response = await request({
            body: this.buildRequestObject(payment),
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            json: true,
            method: 'POST',
            uri: `${this.baseUri}/payments/payment`,
        });

        payment.paymentId = response.id;
        payment.redirectUri = response.links.find((x) => x.method === 'REDIRECT').href;

        return payment;
    }

    public async verify(paymentId: string): Promise<boolean> {
        const accessToken: string = await this.getAccessToken();

        const response = await request({
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            json: true,
            method: 'GET',
            uri: `${this.baseUri}/payments/payment/${paymentId}`,
        });

        const result: boolean = response.payer.status === 'VERIFIED';

        if (result) {
            this.logger.info(`Payment ${paymentId} has been verified`);
        } else {
            this.logger.warning(`Payment ${paymentId} has not been verified`);
        }

        return result;
    }

    private buildRequestObject(payment: Payment): any {
        const argv = yargs.argv;

        return {
            intent: 'sale',
            note_to_payer: `World of Rations Suite Subscription`,
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                cancel_url: `${argv.port ? 'https://suite.worldofrations.com' : 'http://localhost:4200'}/billing`,
                return_url: `${argv.port ? 'https://suite.worldofrations.com' : 'http://localhost:4200'}/billing`,
            },
            transactions: [
                {
                    amount: {
                        currency: 'USD',
                        total: payment.amount.toString(),
                    },
                    item_list: {
                        items: [
                            {
                                currency: 'USD',
                                description: `${payment.subscription.toUpperCase()} Subscription for ${payment.period} Days`,
                                name: `${payment.subscription.toUpperCase()} Subscription`,
                                price: payment.amount.toString(),
                                quantity: '1',
                            },
                        ],
                    },
                },
            ],
        };
    }

    private async getAccessToken(): Promise<string> {

        if (!PayPalPaymentGateway.accessToken) {
            const response = await request({
                body: 'grant_type=client_credentials',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Language': 'en_US',
                    'Authorization': `Basic ${new Buffer(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                uri: `${this.baseUri}/oauth2/token`,
            });

            PayPalPaymentGateway.accessToken = JSON.parse(response).access_token;
        }

        return PayPalPaymentGateway.accessToken;
    }
}
