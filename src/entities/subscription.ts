export abstract class Subscription {

    private permissions: string[] = [];

    public type: string = null;

    constructor(
        public active: boolean,
        additionalPermissions: string[],
        public endTimestamp: Date,
        public expired: boolean,
        public id: number,
        public startTimestamp: Date,
        public token: string,

    ) {
        this.permissions = this.permissions.concat(additionalPermissions);

        this.type = this.toString().toLowerCase();
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

    public abstract toString(): string;

}
