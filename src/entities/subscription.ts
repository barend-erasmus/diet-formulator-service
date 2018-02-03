export class Subscription {

    private permissions: string[] = [];

    constructor(
        private active: boolean,
        private expiryTimestamp: Date,
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
