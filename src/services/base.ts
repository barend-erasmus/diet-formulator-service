export class BaseService {

    public getUserPermissions(username: string): string[] {

        const superUserUsernames: string[] = [
            'developersworkspace@gmail.com',
        ];

        const permissions: string[] = [];

        permissions.push('view-nutrient');
        permissions.push('view-diet-group');
        permissions.push('view-diet');
        permissions.push('view-ingredient');
        permissions.push('create-diet');
        permissions.push('update-diet');

        if (superUserUsernames.indexOf(username) > -1) {

            permissions.push('super-user');

            permissions.push('create-application');
            permissions.push('view-application');
            permissions.push('update-application');

            permissions.push('create-nutrient');
            permissions.push('update-nutrient');

            permissions.push('create-diet-group');
            permissions.push('update-diet-group');

            permissions.push('create-diet');
            permissions.push('update-diet');

            permissions.push('create-ingredient');
            permissions.push('update-ingredient');

            permissions.push('view-diet-values');
            permissions.push('view-ingedient-values');

        }

        return permissions;
    }

    public hasPermission(username: string, permission: string): boolean {
        const permissions: string[] = this.getUserPermissions(username);

        if (permissions.indexOf(permission) > -1) {
            return true;
        }

        return false;
    }
}
