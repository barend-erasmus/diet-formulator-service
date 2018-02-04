import { TrialSubscription } from './trail-subscription';

export class BasicSubscription extends TrialSubscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        startTimestamp: Date,
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-suggested-value'].concat(additionalPermissions);

        super(active, expiryTimestamp, startTimestamp, permissions);

        this.type = 'basic';
    }
}
