import { Ingredient } from "./ingredient";
import { IngredientGroup } from "./ingredient-group";
import { IngredientValue } from "./ingredient-value";

export class FormulationIngredient {
    constructor(
        public id: number,
        public ingredient: Ingredient,
        public cost: number,
        public minimum: number,
        public maximum: number,
        public weight: number,
    ) {
    }

    public removeValues(): void {
        this.ingredient.removeValues();
    }
}
