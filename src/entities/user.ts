import { ISubscription } from "../interfaces/subscription";

export class User {
    constructor(
        public email: string,
        public displayName: string,
        public verified: boolean,
        public picture: string,
        public subscriptionType: string,
        public isSuperAdmin: boolean,
        public locale: string,
        public country: string,
        public subscription: ISubscription,
    ) {

    }
}
