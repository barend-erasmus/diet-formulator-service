import { IUserRepository } from "../repositories/user";
import { User } from "../entities/user";

export class UserService {
    constructor(
        private userRepository: IUserRepository,
    ) {

    }

    public async create(user: User, token: string): Promise<User> {
        return this.userRepository.create(user, token);
    }

    public async find(token: string): Promise<User> {
        return this.userRepository.find(token);
    }
}