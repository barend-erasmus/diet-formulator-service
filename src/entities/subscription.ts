export class Subscription {

    private permissions: string[] = [];

    public expired: boolean = false;

    public type: string = null;

    constructor(
        public active: boolean,
        additionalPermissions: string[],
        public expiryTimestamp: Date,
        public startTimestamp: Date,

    ) {
        this.permissions = this.permissions.concat(additionalPermissions);
    }

    public hasPermission(permission: string): boolean {
        if (this.permissions.indexOf(permission) > -1) {
            return true;
        }

        return false;
    }

    public setPermissions(permissions: string[]): void {
        this.permissions = permissions;
    }
}
