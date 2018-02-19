import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as uuid from 'uuid';
import { Payment } from '../entities/payment';
import { User } from '../entities/user';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { IPaymentGateway } from '../interfaces/payment-gateway';
import { IPaymentNotificationRepository } from '../repositories/payment-notification';

@injectable()
export class PayFastPaymentGateway implements IPaymentGateway {

    private sandbox: boolean = false;

    constructor(
        private merchantId: string,
        private merchantSecret: string,
        private passPhrase: string,
        @inject('IPaymentNotificationRepository')
        private paymentNotificationRepository: IPaymentNotificationRepository,
    ) {

    }

    public async create(payment: Payment, user: User): Promise<Payment> {
        await this.throwIfInvalidCurrency(payment);

        const paymentId: string = uuid.v4();

        const params: any = {
            amount: payment.amount.toString(),
            cancel_url: `https://suite.worldofrations.com/billing?paymentId=${paymentId}`,
            email_address: user.email,
            item_description: `${payment.subscription.toUpperCase()} Subscription for ${payment.period} Days`,
            item_name: 'World of Rations Suite Subscription',
            m_payment_id: paymentId,
            merchant_id: this.sandbox ? '10000100' : this.merchantId,
            merchant_key: this.sandbox ? '46f0cd694581a' : this.merchantSecret,
            name_first: user.displayName,
            notify_url: 'https://api.suite.worldofrations.com/api/payment/notify',
            payment_method: 'cc',
            return_url: `https://suite.worldofrations.com/billing?paymentId=${paymentId}`,
        };

        const sortedKeys: string[] = Object.keys(params);

        payment.paymentId = params['m_payment_id'];

        payment.redirectUri = `${this.sandbox ? 'https://sandbox.payfast.co.za' : 'https://www.payfast.co.za'}/eng/process?${sortedKeys.map((key) => `${key}=${params[key]}`).join('&')}`;

        return payment;
    }

    public async defaultCurrency(): Promise<string> {
        return 'ZAR';
    }

    public async verify(paymentId: string): Promise<boolean> {

        // {
        //         "m_payment_id":"01AB",
        //         "pf_payment_id":"576846",
        //         "payment_status":"COMPLETE",
        //         "item_name":"Test Item",
        //         "item_description":"A test product",
        //         "amount_gross":"100.00",
        //         "amount_fee":"-2.28",
        //         "amount_net":"97.72",
        //         "custom_str1":"Extra order information",
        //         "custom_str2":"",
        //         "custom_str3":"",
        //         "custom_str4":"",
        //         "custom_str5":"",
        //         "custom_int1":"2",
        //         "custom_int2":"",
        //         "custom_int3":"",
        //         "custom_int4":"",
        //         "custom_int5":"",
        //         "name_first":"Test",
        //         "name_last":"User 01",
        //         "email_address":"sbtu01@payfast.co.za",
        //         "merchant_id":"10000100",
        //         "signature":"e6c2b66ab2034d680a1339a1db391836"
        // }

        const status: string = await this.paymentNotificationRepository.status(paymentId);

        const result: boolean = status.toUpperCase() === 'COMPLETE';

        return result;
    }

    private async throwIfInvalidCurrency(payment: Payment): Promise<void> {
        const defaultCurrency: string = await this.defaultCurrency();

        if (payment.currency !== defaultCurrency) {
            throw new WorldOfRationsError('invalid_currency', 'Invalid Currency');
        }
    }
}
