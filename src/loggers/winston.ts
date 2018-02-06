import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as winston from 'winston';
import { ILogger } from '../interfaces/logger';

@injectable()
export class WinstonLogger implements ILogger {

    public logger: any;

    constructor() {
        this.logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: 'diet-formulator-service.log' }),
            ],
        });
    }

    public debug(message: string): void {
        this.logger.debug(message);
    }

    public error(error: Error): void {
        this.logger.error(error);
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public warning(message: string): void {
        this.logger.warn(message);
    }
}
