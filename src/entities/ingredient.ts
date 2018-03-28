import { ValidationError } from '../errors/validation-error';
import { ErrorField } from '../models/error-field';
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
        const errorFields: ErrorField[] = [];

        if (!this.name) {
            errorFields.push(new ErrorField('ingredient.name', 'Name cannot be empty'));
        }

        if (!this.group) {
            errorFields.push(new ErrorField('ingredient.group', 'Name cannot be empty'));
        }

        if (errorFields.length > 0) {
            throw new ValidationError('invalid_ingredient', 'Ingredient is invalid', errorFields);
        }
    }

}
