import { Nutrient } from "./nutrient";

export class IngredientValue {
    constructor(
        public value: number,
        public nutrient: Nutrient,
    ) {

    }
}
