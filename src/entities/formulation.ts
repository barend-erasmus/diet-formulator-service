import { Diet } from "./diet";
import { FormulationIngredient } from "./formulation-ingredient";

export class Formulation {
    constructor(
        public id: number,
        public diet: Diet,
        public formulationIngredients: FormulationIngredient[],
        public cost: number,
        public feasible: boolean,
    ) {

    }
}