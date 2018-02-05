import { Payment } from "../entities/payment";

export interface IPaymentGateway {
    create(payment: Payment): Promise<Payment>;
}