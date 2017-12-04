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

    public validate(): void {
        const messages: string[] = [];

        if (!this.name) {
            messages.push('Name cannot be empty');
        }

        if (!this.group) {
            messages.push('Group cannot be empty');
        }

        if (messages.length > 0) {
            throw new Error(messages.join(';'));
        }
    }
}
