import { PremiumSubscription } from './premium-subscription';

export class SuperAdminSubscription extends PremiumSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        endTimestamp: Date,
        expired: boolean,
        id: number,
        startTimestamp: Date,
        token: string,
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

        super(
            active,
            permissions,
            endTimestamp,
            expired,
            id,
            startTimestamp,
            token,
        );
    }

    public toString(): string {
        return 'Super-Admin';
    }

}
