export class DietFormulatorError extends Error {
    constructor(
        public code: string,
        public detailedMessage: string,
    ) {
        super(detailedMessage);
    }

    public static fromError(err): DietFormulatorError {
        if (!err.detailedMessage) {
            return new DietFormulatorError('system_error', err.message);
        }

        return err;
    }
}
