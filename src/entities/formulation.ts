import { Diet } from "./diet";
import { FormulationIngredient } from "./formulation-ingredient";

export class Formulation {
    constructor(
        public id: number,
        public name: string,
        public diet: Diet,
        public formulationIngredients: FormulationIngredient[],
        public cost: number,
        public feasible: boolean,
    ) {

    }

    public removeValues(): void {
        this.diet.removeValues();
        
        for (const formulationIngredient of this.formulationIngredients) {
            formulationIngredient.removeValues();
        }
    }
}
