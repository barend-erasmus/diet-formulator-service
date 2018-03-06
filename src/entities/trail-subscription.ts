import { PremiumSubscription } from './premium-subscription';

export class TrialSubscription extends PremiumSubscription {

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
            additionalPermissions,
            endTimestamp,
            expired,
            id,
            startTimestamp,
            token,
        );
    }

    public toString(): string {
        return 'Trial';
    }
}
