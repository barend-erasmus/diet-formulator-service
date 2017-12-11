import { User } from "../entities/user";
import { IUserRepository } from "../repositories/user";
import { BaseService } from "./base";

export class UserService extends BaseService {
    constructor(
        userRepository: IUserRepository,
    ) {
        super(userRepository);
    }

    public async login(user: User, token: string): Promise<User> {

        let result: User = await this.userRepository.findByUsername(user.email);

        if (!result) {
            result = await this.userRepository.create(user, token)
        } else {
            result = await this.userRepository.update(user, token);
        }

        result.permissions = await this.getUserPermissions(user.email);

        return result;
    }

    public async find(token: string): Promise<User> {
        const user: User = await this.userRepository.find(token);

        if (!user) {
            return null;
        }

        user.permissions = await this.getUserPermissions(user.email);

        return user;
    }
}
