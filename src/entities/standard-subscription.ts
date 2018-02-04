import { BasicSubscription } from './basic-subscription';

export class StandardSubscription extends BasicSubscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        startTimestamp: Date,
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-formulation-composition'].concat(additionalPermissions);

        super(active, expiryTimestamp, startTimestamp, permissions);

        this.type = 'standard';
    }
}
