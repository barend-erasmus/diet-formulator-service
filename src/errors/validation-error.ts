import { WorldOfRationsError } from "./world-of-rations-error";
import { ErrorField } from "../models/error-field";

export class ValidationError extends WorldOfRationsError {
    constructor(
        code: string,
        detailedMessage: string,
        public errorFields: ErrorField[],
    ) {
        super(code, detailedMessage);
    }
}