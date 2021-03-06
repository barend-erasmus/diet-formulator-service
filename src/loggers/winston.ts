import { injectable } from 'inversify';
import * as path from 'path';
import 'reflect-metadata';
import * as winston from 'winston';

import { ILogger } from '../interfaces/logger';

@injectable()
export class WinstonLogger implements ILogger {

    public logger: winston.LoggerInstance;

    constructor(name: string) {
        this.logger = new (winston.Logger)({
            level: 'debug',
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: path.join(__dirname, `diet-formulator-service-${name}.log`) }),
            ],
        });
    }

    public debug(message: string, metaData?: any): void {
        this.logger.debug(message, metaData);
    }

    public error(error: Error, metaData?: any): void {
        this.logger.error(error.message, error);
    }

    public info(message: string, metaData?: any): void {
        this.logger.info(message, metaData);
    }

    public warning(message: string, metaData?: any): void {
        this.logger.warn(message, metaData);
    }

}
