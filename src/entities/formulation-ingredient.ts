import { Ingredient } from "./ingredient";
import { IngredientGroup } from "./ingredient-group";
import { IngredientValue } from "./ingredient-value";

export class FormulationIngredient extends Ingredient {
    constructor(
        id: number,
        name: string,
        description: string,
        username: string,
        group: IngredientGroup,
        values: IngredientValue[],
        public cost: number,
        public minimum: number,
        public maximum: number,
        public weight: number,
    ) {
        super(id, name, description, username, group, values);
    }
}