import { DietGroupEvent } from './diet-group';

export class DietGroupUpdatedEvent extends DietGroupEvent {
    constructor(
        userName: string,
    ) {
        super('updated', userName);
    }
}
