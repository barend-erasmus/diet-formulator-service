import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { IFormulationRepository } from '../formulation';
import { Formulation } from '../../entities/formulation';

export class FormulationRepository extends BaseRepository implements IFormulationRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(formulation: Formulation, username: string): Promise<Formulation> {

        const result: any = await BaseRepository.models.Formulation.create({
            name: formulation.name,
            username,
            dietId: formulation.diet.id,
            formulationIngredients: formulation.formulationIngredients.map((formulationIngredient) => {
                return {
                    cost: formulationIngredient.cost,
                    maximum: formulationIngredient.maximum,
                    minimum: formulationIngredient.minimum,
                    ingredientId: formulationIngredient.ingredient.id,
                };
            }),
        }, {

                include: [
                    {
                        model: BaseRepository.models.FormulationIngredient,
                    },
                ],
            });

        formulation.id = result.id;

        return formulation;
    }
}
