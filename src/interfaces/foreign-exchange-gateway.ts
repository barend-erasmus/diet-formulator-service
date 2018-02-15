export interface IForeignExchangeGateway {
    convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
}
