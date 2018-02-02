import { Nutrient } from './nutrient';

export class FormulationCompositionValue {
    constructor(
        public value: number,
        public nutrient: Nutrient,
        public status: string,
    ) {

    }
}
