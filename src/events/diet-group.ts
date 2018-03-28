import { IEvent } from '../interfaces/event';

export class DietGroupEvent implements IEvent {

    constructor(
        public type: string,
        public userName: string,
    ) {

    }

}
