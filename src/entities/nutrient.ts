export class Nutrient {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public code: string,
        public abbreviation: string,
        public unit: string,
        public sortOrder: number,
    ) {

    }

    public validate(): void {
        const messages: string[] = [];

        if (!this.name) {
            messages.push('Name cannot be empty');
        }

        if (!this.code) {
            messages.push('Code cannot be empty');
        }

        if (!this.abbreviation) {
            messages.push('Abbreviation cannot be empty');
        }

        if (!this.unit) {
            messages.push('Unit cannot be empty');
        }

        if (!this.sortOrder) {
            messages.push('Sort Order cannot be empty');
        }

        if (messages.length > 0) {
            throw new Error(messages.join(';'));
        }
    }
}