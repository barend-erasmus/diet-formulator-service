import { BasicSubscription } from './basic-subscription';

export class StandardSubscription extends BasicSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        expiryTimestamp: Date,
        startTimestamp: Date,
    ) {
        const permissions: string[]  = ['view-formulation-composition'].concat(additionalPermissions);

        super(active, permissions, expiryTimestamp, startTimestamp);

        this.type = 'standard';
    }
}
