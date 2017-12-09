import { Ingredient } from "./ingredient";

export class SupplementIngredient {
    constructor(
        public ingredient: Ingredient,
        public weight: number,
    ) {

    }

    public removeValues(): void {
        this.ingredient.removeValues();
    }
}