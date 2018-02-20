export interface ILogger {
    debug(message: string, metaData?: any): void;
    error(error: Error, metaData?: any): void;
    info(message: string, metaData?: any): void;
    warning(message: string, metaData?: any): void;
}
