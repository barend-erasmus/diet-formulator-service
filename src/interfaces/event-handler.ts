import { IEvent } from './event';

export interface IEventHandler<T extends IEvent> {
    handle(event: T): Promise<T>;
}
