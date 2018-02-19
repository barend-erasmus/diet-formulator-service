import { injectable } from 'inversify';
import 'reflect-metadata';
import * as request from 'request-promise';
import { IForeignExchangeGateway } from '../interfaces/foreign-exchange-gateway';

@injectable()
export class FixerForeignExchangeGateway implements IForeignExchangeGateway {

    public async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        const response = await request({
            json: true,
            method: 'GET',
            uri: `https://api.fixer.io/latest?base=${fromCurrency}`,
        });

        const rate: number = response.rates[toCurrency];

        return Math.round(amount * rate * 100) / 100;
    }

}
