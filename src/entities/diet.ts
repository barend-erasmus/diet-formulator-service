import { DietGroup } from "./diet-group";
import { DietValue } from "./diet-value";

export class Diet {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public username: string,
        public group: DietGroup,
        public values: DietValue[],
    ) {

    }
}
