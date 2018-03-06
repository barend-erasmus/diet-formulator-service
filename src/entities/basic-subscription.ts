import { Subscription } from './subscription';

export class BasicSubscription extends Subscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        endTimestamp: Date,
        expired: boolean,
        id: number,
        startTimestamp: Date,
        token: string,
    ) {
        super(active,
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
            ].concat(additionalPermissions),
            endTimestamp,
            expired,
            id,
            startTimestamp,
            token,
        );
    }

    public toString(): string {
        return 'Basic';
    }
}
