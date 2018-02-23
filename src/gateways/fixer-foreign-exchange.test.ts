import { expect } from 'chai';
import 'mocha';
import { IForeignExchangeGateway } from '../interfaces/foreign-exchange-gateway';
import { FixerForeignExchangeGateway } from './fixer-foreign-exchange';

describe('FixerForeignExchangeGateway - Integration', () => {

    let foreignExchangeGateway: IForeignExchangeGateway = null;

    before(async () => {
        foreignExchangeGateway = new FixerForeignExchangeGateway();
    });

    describe('convert', () => {

        it('should return number given ZAR to USD', async () => {

            const result: number = await foreignExchangeGateway.convert(10, 'ZAR', 'USD');

            expect(result).to.be.not.null;
            
        });

        it('should return number given USD to ZAR', async () => {

            const result: number = await foreignExchangeGateway.convert(10, 'USD', 'ZAR');

            expect(result).to.be.not.null;
            
        });

        it('should return number given ZAR to EUR', async () => {

            const result: number = await foreignExchangeGateway.convert(10, 'ZAR', 'EUR');

            expect(result).to.be.not.null;
            
        });

        it('should return number given EUR to ZAR', async () => {

            const result: number = await foreignExchangeGateway.convert(10, 'EUR', 'ZAR');

            expect(result).to.be.not.null;
            
        });

    });

});
