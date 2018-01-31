import { TrialSubscription } from "./trail";

export class BasicSubscription extends TrialSubscription {
    
    constructor(
        additionalPermissions: string[],
    ) {
        const permissions: string[]  = ['view-suggested-value'].concat(additionalPermissions);

        super(permissions);
    }
}