export class WorldOfRationsError extends Error {
    constructor(
        public code: string,
        public detailedMessage: string,
    ) {
        super(detailedMessage);
    }

    public static fromError(err): WorldOfRationsError {

        console.error(err);

        if (!err.detailedMessage) {
            return new WorldOfRationsError('system_error', err.message);
        }

        return err;
    }
}
