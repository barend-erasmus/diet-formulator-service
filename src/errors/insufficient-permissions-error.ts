import { DietFormulatorError } from './diet-formulator-error';

export class InsufficientPermissionsError extends DietFormulatorError {
    constructor(
        code: string,
        detailedMessage: string,
        public requiredPermission: string,
        public userName: string,
    ) {
        super(code, detailedMessage);
    }
}
