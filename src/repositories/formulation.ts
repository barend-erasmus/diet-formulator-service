import { Formulation } from "../entities/formulation";
import { SuggestedValue } from "../entities/suggested-value";

export interface IFormulationRepository {
    create(formulation: Formulation, username: string): Promise<Formulation>;
    find(formulationId: number): Promise<Formulation>;
    findSuggestedValue(dietGroupId: number, ingredientId: number): Promise<SuggestedValue>;
    list(username: string): Promise<Formulation[]>;
}
