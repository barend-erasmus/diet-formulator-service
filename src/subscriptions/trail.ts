import { ISubscription } from "../interfaces/subscription";

export class TrialSubscription implements ISubscription {
    
    private permissions: string[] = [
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
    ];
    
    constructor(
        additionalPermissions: string[],
    ) {
        this.permissions = this.permissions.concat(additionalPermissions);
    }

    public hasPermission(permission: string): boolean {
       if (this.permissions.indexOf(permission) > -1) {
            return true;
        }

        return false;
    }
}