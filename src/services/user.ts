import { User } from "../entities/user";
import { IUserRepository } from "../repositories/user";
import { BaseService } from "./base";

export class UserService extends BaseService {
    constructor(
        private userRepository: IUserRepository,
    ) {
        super();
    }

    public async create(user: User, token: string): Promise<User> {

        const result: User = await this.userRepository.create(user, token);

        result.permissions = this.getUserPermissions(user.email);

        return result;
    }

    public async find(token: string): Promise<User> {
        const user: User = await this.userRepository.find(token);

        if (!user) {
            return null;
        }

        user.permissions = this.getUserPermissions(user.email);

        return user;
    }
}
