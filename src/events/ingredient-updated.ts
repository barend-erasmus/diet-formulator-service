import { IngredientEvent } from './ingredient';

export class IngredientUpdatedEvent extends IngredientEvent {
    constructor(
        userName: string,
    ) {
        super('updated', userName);
    }
}
