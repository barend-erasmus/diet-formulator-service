import { IngredientGroup } from './ingredient-group';
import { IngredientValue } from './ingredient-value';

export class Ingredient {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public userName: string,
        public group: IngredientGroup,
        public values: IngredientValue[],
    ) {

    }

    public removeValues(): void {
        this.values = [];
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
