import { StandardSubscription } from "./standard";

export class PremiumSubscription extends StandardSubscription {
    
    constructor(
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-formulation-supplement'].concat(additionalPermissions);

        super(permissions);
    }
}