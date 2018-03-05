import { PremiumSubscription } from './premium-subscription';

export class SuperAdminSubscription extends PremiumSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        endTimestamp: Date,
        id: number,
        startTimestamp: Date,
    ) {
        const permissions: string[] = [
            'create-nutrient',
            'update-nutrient',
            'create-diet-group',
            'update-diet-group',
            'create-ingredient',
            'update-ingredient',
            'create-suggested-value',
            'remove-suggested-value',
            'update-suggested-value',
            'view-diet-values',
            'view-ingedient-values',
            'view-formulation-values',
            'view-formulation-supplement-values',
            'super-user',
        ].concat(additionalPermissions);

        super(active, permissions, endTimestamp, id, startTimestamp);

        this.type = 'super-admin';
    }
}
