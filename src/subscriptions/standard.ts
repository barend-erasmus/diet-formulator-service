import { BasicSubscription } from './basic';

export class StandardSubscription extends BasicSubscription {

    constructor(
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-formulation-composition'].concat(additionalPermissions);

        super(permissions);
    }
}
