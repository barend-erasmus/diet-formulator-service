import { StandardSubscription } from './standard-subscription';

export class PremiumSubscription extends StandardSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        endTimestamp: Date,
        expired: boolean,
        id: number,
        startTimestamp: Date,
        token: string,
    ) {
        const permissions: string[] = ['view-formulation-supplement'].concat(additionalPermissions);

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
        return 'Premium';
    }

}
