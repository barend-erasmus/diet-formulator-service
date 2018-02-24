import { ErrorField } from "../models/error-field";
import { ValidationError } from "../errors/validation-error";

export class DietGroup {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public parent: DietGroup,
    ) {

    }

    public validate(): void {
        const errorFields: ErrorField[] = [];

        if (!this.name) {
            errorFields.push(new ErrorField('diet-group.name', 'Name cannot be empty'));
        }

        if (errorFields.length > 0) {
            throw new ValidationError('invalid_diet_group', 'Diet Group is invalid', errorFields);
        }
    }
}
