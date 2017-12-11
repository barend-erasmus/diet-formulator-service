import { User } from "../entities/user";
import { IUserRepository } from "../repositories/user";

export class BaseService {

    constructor(
        protected userRepository: IUserRepository,
    ) {

    }

    public async getUserPermissions(username: string): Promise<string[]> {

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
                'view-formulation-composition',
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
                'view-formulation-composition',
                'view-formulation-supplement',
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

    public async hasPermission(username: string, permission: string): Promise<boolean> {
        const permissions: string[] = await this.getUserPermissions(username);

        if (permissions.indexOf(permission) > -1) {
            return true;
        }

        return false;
    }
}
