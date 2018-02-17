import { StandardSubscription } from './standard-subscription';

export class PremiumSubscription extends StandardSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        expiryTimestamp: Date,
        startTimestamp: Date,
    ) {
        const permissions: string[]  = ['view-formulation-supplement'].concat(additionalPermissions);

        super(active, permissions, startTimestamp, expiryTimestamp);

        this.type = 'premium';
    }
}
