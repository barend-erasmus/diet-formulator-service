import { Nutrient } from "./nutrient";

export class IngredientValue {
    constructor(
        public id: number,
        public value: number,
        public nutrient: Nutrient,
    ) {

    }
}
