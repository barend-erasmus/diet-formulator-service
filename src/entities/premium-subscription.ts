import { StandardSubscription } from './standard-subscription';

export class PremiumSubscription extends StandardSubscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-formulation-supplement'].concat(additionalPermissions);

        super(active, expiryTimestamp, permissions);
    }
}
