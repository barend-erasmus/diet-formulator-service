import { DietGroup } from "./diet-group";
import { DietValue } from "./diet-value";
import { ErrorField } from "../models/error-field";
import { ValidationError } from "../errors/validation-error";

export class Diet {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public userName: string,
        public group: DietGroup,
        public values: DietValue[],
    ) {

    }

    public clearUserName(): void {
        this.userName = null;
    }

    public validate(): void {
        const errorFields: ErrorField[] = [];

        if (!this.name) {
            errorFields.push(new ErrorField('diet.name', 'Name cannot be empty'));
        }

        if (!this.group) {
            errorFields.push(new ErrorField('diet.group', 'Name cannot be empty'));
        }

        if (errorFields.length > 0) {
            throw new ValidationError('invalid_diet', 'Diet is invalid', errorFields);
        }
    }

    public removeValues(): void {
        this.values = [];
    }

    public setUserName(userName: string): void {
        this.userName = userName;
    }
}
