import * as crypto from 'crypto';
import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import * as request from 'request-promise';
import * as uuid from 'uuid';
import * as yargs from 'yargs';
import { Payment } from '../entities/payment';
import { User } from '../entities/user';
import { ILogger } from '../interfaces/logger';
import { IPaymentGateway } from '../interfaces/payment-gateway';
import { IPaymentNotificationRepository } from '../repositories/payment-notification';

@injectable()
export class PayFastPaymentGateway implements IPaymentGateway {

    private baseUri: string = 'https://sandbox.payfast.co.za';

    private sandbox: boolean = true;

    constructor(
        private merchantId: string,
        private merchantSecret: string,
        private passPhrase: string,
        @inject('ILogger')
        private logger: ILogger,
        @inject('IPaymentNotificationRepository')
        private paymentNotificationRepository: IPaymentNotificationRepository,
    ) {

    }

    public async create(payment: Payment, user: User): Promise<Payment> {

        const paymentId: string = uuid.v4();

        const params: any = {
            merchant_id: this.sandbox ? '10000100' : this.merchantId,
            merchant_key: this.sandbox ? '46f0cd694581a' : this.merchantSecret,
            return_url: `https://suite.worldofrations.com/billing?paymentId=${paymentId}`,
            cancel_url: `https://suite.worldofrations.com/billing?paymentId=${paymentId}`,
            notify_url: 'https://api.suite.worldofrations.com/api/payment/notify',
            name_first: user.displayName,
            email_address: user.email,
            m_payment_id: paymentId,
            amount: (payment.amount * 12).toString(),
            item_name: 'World of Rations Suite Subscription',
            item_description: `${payment.subscription.toUpperCase()} Subscription for ${payment.period} Days`,
            payment_method: 'cc',
        };

        const sortedKeys: string[] = Object.keys(params);

        payment.paymentId = params['m_payment_id'];

        payment.redirectUri = `
        <form action="${this.baseUri}/eng/process" method="POST">

            ${sortedKeys.map((key) => `<input type="hidden" name="${key}" value="${params[key]}">`).join('')}

            <input type="submit" value="Pay" class="btn btn-primary" />
        </form>
        `;

        return payment;
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

        return status.toUpperCase() === 'COMPLETE';
    }
}
