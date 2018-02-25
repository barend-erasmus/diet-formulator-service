import { ValidationError } from '../errors/validation-error';
import { ErrorField } from '../models/error-field';
import { DietGroup } from './diet-group';
import { Ingredient } from './ingredient';

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

    public validate(): void {
        const errorFields: ErrorField[] = [];

        if (!this.dietGroup) {
            errorFields.push(new ErrorField('suggested-value.dietGroup', 'Diet Group cannot be empty'));
        }

        if (!this.ingredient) {
            errorFields.push(new ErrorField('suggested-value.ingredient', 'Ingredient cannot be empty'));
        }

        if (errorFields.length > 0) {
            throw new ValidationError('invalid_suggested_value', 'Suggested Value is invalid', errorFields);
        }
    }
}
