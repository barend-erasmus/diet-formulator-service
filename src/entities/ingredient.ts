import { IngredientGroup } from "./ingredient-group";
import { IngredientValue } from "./ingredient-value";

export class Ingredient {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public username: string,
        public group: IngredientGroup,
        public values: IngredientValue[],
    ) {

    }
}
