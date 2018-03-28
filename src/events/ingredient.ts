import { IEvent } from '../interfaces/event';

export class IngredientEvent implements IEvent {

    constructor(
        public type: string,
        public userName: string,
    ) {
    }

}
