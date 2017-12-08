import { IUserRepository } from "../repositories/user";
import { User } from "../entities/user";

export class BaseService {

    constructor(
        protected userRepository: IUserRepository,
    ) {

    }

    public async getUserPermissions(username: string): Promise<string[]> {

        const user: User = await this.userRepository.findByUsername(username);

        const permissions: string[] = [];

        permissions.push('view-nutrient');
        permissions.push('view-diet-group');
        permissions.push('view-diet');
        permissions.push('view-ingredient');
        permissions.push('create-diet');
        permissions.push('update-diet');
        permissions.push('create-formulation');
        permissions.push('view-formulation');
        permissions.push('view-formulation-composition');
        permissions.push('view-formulation-supplement');

        if (user.isSuperAdmin) {

            permissions.push('super-user');

            permissions.push('create-application');
            permissions.push('view-application');
            permissions.push('update-application');

            permissions.push('create-nutrient');
            permissions.push('update-nutrient');

            permissions.push('create-diet-group');
            permissions.push('update-diet-group');

            permissions.push('create-ingredient');
            permissions.push('update-ingredient');

            permissions.push('view-diet-values');
            permissions.push('view-ingedient-values');

            permissions.push('view-formulation-values');

        }

        return permissions;
    }

    public async hasPermission(username: string, permission: string): Promise<boolean> {
        const permissions: string[] = await this.getUserPermissions(username);

        if (permissions.indexOf(permission) > -1) {
            return true;
        }

        return false;
    }
}
