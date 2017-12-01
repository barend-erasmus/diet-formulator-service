import { Nutrient } from "./nutrient";

export class DietValue {
    constructor(
        public id: number,
        public minimum: number,
        public maximum: number,
        public nutrient: Nutrient,
    ) {

    }
}