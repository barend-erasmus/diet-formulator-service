import { User } from "../entities/user";
import { IUserRepository } from "../repositories/user";
import { InsufficientPermissionsError } from "../errors/insufficient-permissions-error";

export class BaseService {

    constructor(
        protected userRepository: IUserRepository,
    ) {

    }

    protected async getUserPermissions(username: string): Promise<string[]> {

        const user: User = await this.userRepository.findByUsername(username);

        let permissions: string[] = [];

        if (user.packageClass === 'trial') {
            permissions = [
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
        }

        if (user.packageClass === 'basic') {
            permissions = [
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
            ];
        }

        if (user.packageClass === 'standard') {
            permissions = [
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
                'view-formulation-composition',
            ];
        }

        if (user.packageClass === 'premium') {
            permissions = [
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
                'view-formulation-composition',
                'view-formulation-supplement',
            ];
        }

        if (user.isSuperAdmin) {

            permissions = [
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
                'view-formulation-composition',
                'view-formulation-supplement',

                'create-application',
                'view-application',
                'update-application',
                'create-nutrient',
                'update-nutrient',
                'create-diet-group',
                'update-diet-group',
                'create-ingredient',
                'update-ingredient',
                'view-diet-values',
                'view-ingedient-values',
                'view-formulation-values',
                'view-formulation-supplement-values',

                'super-user',
            ];
        }

        return permissions;
    }

    protected async hasPermission(username: string, permission: string): Promise<boolean> {
        const permissions: string[] = await this.getUserPermissions(username);

        if (permissions.indexOf(permission) > -1) {
            return true;
        }

        return false;
    }

    protected async throwIfDoesNotHavePermission(userName: string, permission: string): void {
        if (!await this.hasPermission(userName, permission)) {
            throw new InsufficientPermissionsError('insufficient_permissions', 'Insufficient permissions', permission, userName);
        }
    }
}
