import { injectable } from 'inversify';
import { ILogger } from '../interfaces/logger';

@injectable()
export class ConsoleLogger implements ILogger {

    constructor() {

    }

    public debug(message: string, metaData?: any): void {
        console.log(message);
    }

    public error(error: Error, metaData?: any): void {
        console.error(error);
    }

    public info(message: string, metaData?: any): void {
        console.log(message);
    }

    public warning(message: string, metaData?: any): void {
        console.log(message);
    }

}
