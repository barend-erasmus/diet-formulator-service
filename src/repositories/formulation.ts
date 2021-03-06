import { Formulation } from '../entities/formulation';
import { IBaseRepository } from './base';

export interface IFormulationRepository extends IBaseRepository {
    create(formulation: Formulation, userName: string): Promise<Formulation>;
    find(formulationId: number): Promise<Formulation>;
    list(userName: string): Promise<Formulation[]>;
}
