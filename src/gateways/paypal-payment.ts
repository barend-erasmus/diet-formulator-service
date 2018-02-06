import * as request from 'request-promise';
import { Payment } from '../entities/payment';
import { IPaymentGateway } from '../interfaces/payment-gateway';

export class PayPalPaymentGateway implements IPaymentGateway {

    private baseUri: string = 'https://api.sandbox.paypal.com/v1';

    private static accessToken: string = null;

    constructor(
        private clientId: string,
        private clientSecret: string,
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

        return response.payer.status === 'VERIFIED';
    }

    private buildRequestObject(payment: Payment): any {
        return {
            intent: 'sale',
            note_to_payer: `${payment.subscription.toUpperCase()} Subscription`,
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                cancel_url: 'https://suite.worldofrations.com/billing',
                return_url: 'https://suite.worldofrations.com/billing',
            },
            transactions: [
                {
                    amount: {
                        currency: 'USD',
                        total: payment.amount.toString(),
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
