import { TrialSubscription } from './trail-subscription';

export class BasicSubscription extends TrialSubscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-suggested-value'].concat(additionalPermissions);

        super(active, expiryTimestamp, permissions);
    }
}
