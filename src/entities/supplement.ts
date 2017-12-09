import { Nutrient } from "./nutrient";
import { SupplementIngredient } from "./supplement-ingredient";

export class Supplement {
    constructor(
        public nutrient: Nutrient,
        public supplementIngredients: SupplementIngredient[], 
    ) {

    }
}