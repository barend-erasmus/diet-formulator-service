import { Formulation } from '../entities/formulation';

export interface IFormulator {
    formulate(formulation: Formulation): Promise<Formulation>;
}
