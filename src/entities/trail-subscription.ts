import { PremiumSubscription } from './premium-subscription';

export class TrialSubscription extends PremiumSubscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        startTimestamp: Date,
        additionalPermissions: string[],
    ) {
        super(active,
            expiryTimestamp,
            startTimestamp,
            additionalPermissions);

        this.type = 'trial';
    }

}
