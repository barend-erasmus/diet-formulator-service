import { PremiumSubscription } from './premium-subscription';

export class SuperAdminSubscription extends PremiumSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        expiryTimestamp: Date,
        startTimestamp: Date,
    ) {
        const permissions: string[] = [
            'create-nutrient',
            'update-nutrient',
            'create-diet-group',
            'update-diet-group',
            'create-ingredient',
            'update-ingredient',
            'view-diet-values',
            'view-ingedient-values',
            'view-formulation-values',
            'view-formulation-supplement-values',
            'super-user',
        ].concat(additionalPermissions);

        super(active, permissions, expiryTimestamp, startTimestamp);

        this.type = 'super-admin';
    }
}
