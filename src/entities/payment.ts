export class Payment {
    constructor(
        public amount: number,
        public assigned: boolean,
        public currency: string,
        public paid: boolean,
        public paidTimestamp: Date,
        public paymentId: string,
        public period: number,
        public redirectUri: string,
        public subscription: string,
    ) {

    }
}
