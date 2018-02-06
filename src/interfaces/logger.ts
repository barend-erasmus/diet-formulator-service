export interface ILogger {
    debug(message: string): void;
    error(error: Error): void;
    info(message: string): void;
    warning(message: string): void;
}
