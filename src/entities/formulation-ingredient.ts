import { Ingredient } from './ingredient';

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
