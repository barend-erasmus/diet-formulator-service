import { Diet } from "../entities/diet";
import { IBaseRepository } from "./base";

export interface IDietRepository extends IBaseRepository {
    create(diet: Diet): Promise<Diet>;
    find(dietId: number): Promise<Diet>;
    findComparison(dietId: number): Promise<Diet>;
    list(dietGroupId: number, userName: string): Promise<Diet[]>;
    update(diet: Diet): Promise<Diet>;
}
