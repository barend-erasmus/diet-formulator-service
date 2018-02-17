import { PremiumSubscription } from './premium-subscription';

export class TrialSubscription extends PremiumSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        expiryTimestamp: Date,
        startTimestamp: Date,
    ) {
        super(active,
            additionalPermissions,
            expiryTimestamp,
            startTimestamp,
        );

        this.type = 'trial';
    }

}
