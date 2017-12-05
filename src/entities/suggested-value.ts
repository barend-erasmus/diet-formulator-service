import { DietGroup } from "./diet-group";
import { Ingredient } from "./ingredient";

export class SuggestedValue {
    constructor(
        public id: number,
        public description: number,
        public dietGroup: DietGroup,
        public ingredient: Ingredient,
        public minimum: number,
        public maximum: number,
    ) {

    }
}
