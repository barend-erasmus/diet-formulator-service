import { BasicSubscription } from './basic-subscription';

export class StandardSubscription extends BasicSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        endTimestamp: Date,
        id: number,
        startTimestamp: Date,
    ) {
        const permissions: string[]  = ['view-formulation-composition'].concat(additionalPermissions);

        super(active, permissions, endTimestamp, id, startTimestamp);

        this.type = 'standard';
    }
}
