import { PremiumSubscription } from './premium-subscription';

export class TrialSubscription extends PremiumSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        endTimestamp: Date,
        id: number,
        startTimestamp: Date,
    ) {
        super(active,
            additionalPermissions,
            endTimestamp,
            id,
            startTimestamp,
        );

        this.type = 'trial';
    }

}
