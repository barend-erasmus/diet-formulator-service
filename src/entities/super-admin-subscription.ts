import { PremiumSubscription } from './premium-subscription';

export class SuperAdminSubscription extends PremiumSubscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        startTimestamp: Date,
        additionalPermissions: string[],
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

        super(active, expiryTimestamp, startTimestamp, permissions);

        this.type = 'super-admin';
    }
}
