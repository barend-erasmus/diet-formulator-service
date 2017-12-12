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
            result = await this.userRepository.create(user, token);
        } else {
            result.packageClass = user.packageClass;
            result.verified = user.verified;
            result = await this.userRepository.update(result, token);
        }

        result.permissions = await this.getUserPermissions(result.email);

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

    public async update(user: User, token: string): Promise<User> {
        const existingUser: User = await this.userRepository.find(token);

        if (!user) {
            return null;
        }

        existingUser.country = user.country;
        existingUser.displayName = user.displayName;
        existingUser.locale = user.locale;
        existingUser.picture = user.picture;

        await this.userRepository.update(existingUser, token);

        existingUser.permissions = await this.getUserPermissions(user.email);

        return existingUser;
    }
}
