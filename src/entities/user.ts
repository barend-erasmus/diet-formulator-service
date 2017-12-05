export class User {
    constructor(
        public email: string,
        public verified: boolean,
        public picture: string,
        public permissions: string[],
    ) {

    }
}
