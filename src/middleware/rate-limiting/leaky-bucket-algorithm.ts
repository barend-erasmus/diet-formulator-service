export class LeakyBucketAlgorithm {

    private numberOfDrops: number = 0;

    private timestampOfLastDropLeak: Date = new Date(-8640000000000000);

    constructor(
        private millisecondsBetweenDropLeaks: number,
        private sizeInDrops: number,
    ) {

    }

    public addDrop(): boolean {
        const currentTimestamp = new Date();

        const millisecondsSinceLastDropLeaked: number = currentTimestamp.getTime() - this.timestampOfLastDropLeak.getTime();

        const numberOfDropsToLeak: number = Math.floor(millisecondsSinceLastDropLeaked / this.millisecondsBetweenDropLeaks);

        if (numberOfDropsToLeak > 0) {

            if (this.numberOfDrops <= numberOfDropsToLeak) {
                this.numberOfDrops = 0;
            } else {
                this.numberOfDrops -= numberOfDropsToLeak;
            }

            this.timestampOfLastDropLeak = currentTimestamp;
        }

        if (this.numberOfDrops < this.sizeInDrops) {
            this.numberOfDrops++;
            return true;
        }

        return false;
    }

    public getMillisecondsBetweenDropLeaks(): number {
        return this.millisecondsBetweenDropLeaks;
    }

    public getNumberOfDrops(): number {
        return this.numberOfDrops;
    }

    public getTimestampOfLastDropLeak(): Date {
        return this.timestampOfLastDropLeak;
    }

    public toString(): string {
        return [
            `Burst of ${this.sizeInDrops} drops every ${this.milisecondsToString(this.sizeInDrops * this.millisecondsBetweenDropLeaks)}`,
            `Average of ${this.numberToString(1000 / this.millisecondsBetweenDropLeaks)} drops per second`,
            `Average of ${this.numberToString(60000 / this.millisecondsBetweenDropLeaks)} drops per minute`,
        ].join('\r\n');
    }

    private milisecondsToString(value: number): string {
        if (value < 1000) {
            return `${this.numberToString(value)} milliseconds`;
        } else if (value >= 1000 && value < 60000) {
            return `${this.numberToString(value / 1000)} seconds`;
        } else if (value >= 60000 && value < 3600000) {
            return `${this.numberToString(value / 1000 / 60)} minutes`;
        } else {
            return `${this.numberToString(value / 1000 / 60 / 60)} hours`;
        }
    }

    private numberToString(value: number): string {
        return (Math.round(value * 1000) / 1000).toString();
    }

}
