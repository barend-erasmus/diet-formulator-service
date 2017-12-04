import { Diet } from "../entities/diet";

export interface IDietRepository {
    create(diet: Diet): Promise<Diet>;
    find(dietId: number): Promise<Diet>;
    list(dietGroupId: number): Promise<Diet[]>;
    update(diet: Diet): Promise<Diet>;
}
