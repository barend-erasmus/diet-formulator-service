export class User {
    constructor(
        public email: string,
        public displayName: string,
        public verified: boolean,
        public picture: string,
        public packageClass: string,
        public isSuperAdmin: boolean,
        public permissions: string[],
    ) {

    }
}