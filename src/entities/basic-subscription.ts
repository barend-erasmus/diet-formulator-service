import { Subscription } from './subscription';

export class BasicSubscription extends Subscription {

    constructor(
        active: boolean,
        expiryTimestamp: Date,
        startTimestamp: Date,
        additionalPermissions: string[],
    ) {
        super(active,
            expiryTimestamp,
            startTimestamp,
            [
                'view-profile',
                'update-profile',
                'view-nutrient',
                'view-diet-group',
                'create-diet',
                'view-diet',
                'update-diet',
                'view-ingredient',
                'create-formulation',
                'view-formulation',
                'view-suggested-value',
                'view-billing',
            ].concat(additionalPermissions));

        this.type = 'basic';
    }
}
