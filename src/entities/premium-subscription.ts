import { StandardSubscription } from './standard-subscription';

export class PremiumSubscription extends StandardSubscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        startTimestamp: Date,
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-formulation-supplement'].concat(additionalPermissions);

        super(active, startTimestamp, expiryTimestamp, permissions);

        this.type = 'premium';
    }
}
