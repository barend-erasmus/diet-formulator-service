import { StandardSubscription } from './standard-subscription';

export class PremiumSubscription extends StandardSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        endTimestamp: Date,
        id: number,
        startTimestamp: Date,
    ) {
        const permissions: string[]  = ['view-formulation-supplement'].concat(additionalPermissions);

        super(active, permissions, endTimestamp, id, startTimestamp);

        this.type = 'premium';
    }
}
