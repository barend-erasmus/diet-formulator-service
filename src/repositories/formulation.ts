import { Formulation } from "../entities/formulation";
import { SuggestedValue } from "../entities/suggested-value";
import { IBaseRepository } from "./base";

export interface IFormulationRepository extends IBaseRepository {
    create(formulation: Formulation, userName: string): Promise<Formulation>;
    find(formulationId: number): Promise<Formulation>;
    findSuggestedValue(dietGroupId: number, ingredientId: number): Promise<SuggestedValue>;
    list(userName: string): Promise<Formulation[]>;
}
