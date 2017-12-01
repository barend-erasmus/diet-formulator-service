export class DietGroup {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public parent: DietGroup,
    ) {

    }
}