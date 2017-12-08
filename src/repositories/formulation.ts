import { Formulation } from "../entities/formulation";

export interface IFormulationRepository {
    create(formulation: Formulation, username: string): Promise<Formulation>;
    find(formulationId: number): Promise<Formulation>;
}