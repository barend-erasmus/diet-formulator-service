import { BasicSubscription } from './basic-subscription';

export class StandardSubscription extends BasicSubscription {

    constructor(
        active: boolean,
        additionalPermissions: string[],
        endTimestamp: Date,
        expired: boolean,
        id: number,
        startTimestamp: Date,
        token: string,
    ) {
        const permissions: string[] = ['view-formulation-composition'].concat(additionalPermissions);

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
        return 'Standard';
    }

}
