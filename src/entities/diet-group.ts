export class DietGroup {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public parent: DietGroup,
    ) {

    }

    public validate(): void {
        const messages: string[] = [];

        if (!this.name) {
            messages.push('Name cannot be empty');
        }

        if (messages.length > 0) {
            throw new Error(messages.join(';'));
        }
    }
}
