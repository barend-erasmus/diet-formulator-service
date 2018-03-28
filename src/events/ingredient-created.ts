import { IngredientEvent } from './ingredient';

export class IngredientCreatedEvent extends IngredientEvent {

    constructor(
        userName: string,
    ) {
        super('created', userName);
    }

}
