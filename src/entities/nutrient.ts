import { ValidationError } from '../errors/validation-error';
import { ErrorField } from '../models/error-field';

export class Nutrient {

    constructor(
        public id: number,
        public name: string,
        public description: string,
        public code: string,
        public abbreviation: string,
        public unit: string,
        public sortOrder: number,
    ) {

    }

    public validate(): void {
        const errorFields: ErrorField[] = [];

        if (!this.name) {
          errorFields.push(new ErrorField('nutrient.name', 'Name cannot be empty'));
        }

        if (!this.code) {
            errorFields.push(new ErrorField('nutrient.code', 'Code cannot be empty'));
        }

        if (!this.abbreviation) {
            errorFields.push(new ErrorField('nutrient.abbreviation', 'Abbreviation cannot be empty'));
        }

        if (!this.unit) {
            errorFields.push(new ErrorField('nutrient.unit', 'Unit cannot be empty'));
        }

        if (!this.sortOrder) {
            errorFields.push(new ErrorField('nutrient.sortOrder', 'Sort Order cannot be empty'));
        }

        if (errorFields.length > 0) {
            throw new ValidationError('invalid_ingredient', 'Ingredient is invalid', errorFields);
        }
    }

}
