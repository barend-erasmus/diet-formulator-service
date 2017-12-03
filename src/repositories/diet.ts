import { Diet } from "../entities/diet";

export interface IDietRepository {
    create(diet: Diet): Promise<Diet>;
    list(dietGroupId: number): Promise<Diet[]>;
}
