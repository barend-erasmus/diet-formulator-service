import { ValidationError } from '../errors/validation-error';
import { ErrorField } from '../models/error-field';

export class IngredientGroup {
    constructor(
        public id: number,
        public name: string,
        public description: string,
    ) {

    }

    public validate(): void {
        const errorFields: ErrorField[] = [];

        if (!this.name) {
            errorFields.push(new ErrorField('ingredient-group.name', 'Name cannot be empty'));
        }

        if (errorFields.length > 0) {
            throw new ValidationError('invalid_ingredient_group', 'Ingredient Group is invalid', errorFields);
        }
    }
}
