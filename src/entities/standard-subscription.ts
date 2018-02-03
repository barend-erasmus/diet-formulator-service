import { BasicSubscription } from './basic-subscription';

export class StandardSubscription extends BasicSubscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-formulation-composition'].concat(additionalPermissions);

        super(active, expiryTimestamp, permissions);

        this.type = 'standard';
    }
}
