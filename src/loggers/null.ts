import { injectable } from 'inversify';
import { ILogger } from '../interfaces/logger';

@injectable()
export class NullLogger implements ILogger {

    constructor() {

    }

    public debug(message: string, metaData?: any): void {

    }

    public error(error: Error, metaData?: any): void {

    }

    public info(message: string, metaData?: any): void {

    }

    public warning(message: string, metaData?: any): void {

    }

}
