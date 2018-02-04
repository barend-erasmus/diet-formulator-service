import { IEvent } from "./event";

export interface IEventBus<T extends IEvent> {
    publish(event: T): Promise<T>;
}