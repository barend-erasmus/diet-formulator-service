import { WorldOfRationsError } from "./world-of-rations-error";

export class InsufficientPermissionsError extends WorldOfRationsError {
    constructor(
        code: string,
        detailedMessage: string,
        public requiredPermission: string,
        public userName: string,
    ) {
        super(code, detailedMessage);
    }
}