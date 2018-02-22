import * as Sequelize from 'sequelize';
import * as winston from 'winston';
import { CacheKeys } from '../../contants/cache-keys';
import { Diet } from '../../entities/diet';
import { DietGroup } from '../../entities/diet-group';
import { DietValue } from '../../entities/diet-value';
import { Ingredient } from '../../entities/ingredient';
import { IngredientGroup } from '../../entities/ingredient-group';
import { IngredientValue } from '../../entities/ingredient-value';
import { Nutrient } from '../../entities/nutrient';
import { Payment } from '../../entities/payment';
import { SuggestedValue } from '../../entities/suggested-value';
import { User } from '../../entities/user';
import { ICache } from '../../interfaces/cache';
import { ILogger } from '../../interfaces/logger';
import { Models } from './models';

export class BaseRepository {
    protected static models: {
        ComparisonDiet: Sequelize.Model<{}, {}>,
        Diet: Sequelize.Model<{}, {}>,
        DietGroup: Sequelize.Model<{}, {}>,
        DietValue: Sequelize.Model<{}, {}>,
        Formulation: Sequelize.Model<{}, {}>,
        FormulationIngredient: Sequelize.Model<{}, {}>,
        Ingredient: Sequelize.Model<{}, {}>,
        IngredientGroup: Sequelize.Model<{}, {}>,
        IngredientValue: Sequelize.Model<{}, {}>,
        Nutrient: Sequelize.Model<{}, {}>,
        Payment: Sequelize.Model<{}, {}>,
        PaymentNotification: Sequelize.Model<{}, {}>,
        Subscription: Sequelize.Model<{}, {}>,
        SuggestedValue: Sequelize.Model<{}, {}>,
        Supplement: Sequelize.Model<{}, {}>,
        User: Sequelize.Model<{}, {}>,
    } = null;

    protected static sequelize: Sequelize.Sequelize = null;

    constructor(
        private host: string,
        private userName: string,
        private password: string,
        private logger: ILogger,
        private cache: ICache,
    ) {
        if (!BaseRepository.sequelize) {

            BaseRepository.sequelize = new Sequelize('world-of-rations', userName, password, {
                dialect: 'postgres',
                host,
                // logging: false,
                logging: (text: string) => {
                    if (!text.startsWith('Executing (default): SELECT')) {
                        this.logger.info(text.substring('Executing (default): '.length, text.length));
                    }
                },
                pool: {
                    idle: 10000,
                    max: 5,
                    min: 0,
                },
            });

            BaseRepository.models = Models.define(BaseRepository.sequelize);
        }
    }

    public dispose(): void {
        if (BaseRepository.sequelize) {
            BaseRepository.sequelize.close();
            BaseRepository.sequelize = null;
        }
    }

    public sync(): Promise<void> {
        return new Promise((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }

    protected async loadDietGroupParent(dietGroup: DietGroup): Promise<DietGroup> {
        if (dietGroup.parent) {

            let parent: DietGroup = await this.cache.getUsingObjectKey({
                id: dietGroup.parent.id,
                key: CacheKeys.BASE_REPOSITORY_LOAD_DIET_GROUP_PARENT,
            }, CacheKeys.SYSTEM_USER_NAME);

            if (!parent) {
                const result: any = await BaseRepository.models.DietGroup.find({
                    where: {
                        id: {
                            [Sequelize.Op.eq]: dietGroup.parent.id,
                        },
                    },
                });

                parent = this.mapToDietGroup(result);

                await this.cache.addUsingObjectKey({
                    id: dietGroup.parent.id,
                    key: CacheKeys.BASE_REPOSITORY_LOAD_DIET_GROUP_PARENT,
                }, parent, null, CacheKeys.SYSTEM_USER_NAME);
            }

            dietGroup.parent = await this.loadDietGroupParent(parent);
        }

        return dietGroup;
    }

    protected mapToDiet(diet: any, dietGroup: DietGroup): Diet {
        return new Diet(diet.id, diet.name, diet.description, diet.userName, dietGroup,
            diet.dietValues.map((value) =>
                new DietValue(
                    value.id,
                    value.minimum,
                    value.maximum,
                    new Nutrient(
                        value.nutrient.id,
                        value.nutrient.name,
                        value.nutrient.description,
                        value.nutrient.code,
                        value.nutrient.abbreviation,
                        value.nutrient.unit,
                        value.nutrient.sortOrder,
                    )),
            ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder));
    }

    protected mapToDietGroup(dietGroup: any): DietGroup {
        return new DietGroup(
            dietGroup.id,
            dietGroup.name,
            dietGroup.description,
            dietGroup.dietGroupId ? new DietGroup(dietGroup.dietGroupId, null, null, null) : null,
        );
    }

    protected mapToIngredient(ingredient: any): Ingredient {
        return new Ingredient(
            ingredient.id,
            ingredient.name,
            ingredient.description, ingredient.userName,
            this.mapToIngredientGroup(ingredient.ingredientGroup),
            ingredient.ingredientValues.map((value) => this.mapToIngredientValue(value),
            ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder));
    }

    protected mapToIngredientGroup(ingredientGroup: any): IngredientGroup {
        return new IngredientGroup(ingredientGroup.id, ingredientGroup.name, ingredientGroup.description);
    }

    protected mapToIngredientValue(ingredientValue: any): IngredientValue {
        return new IngredientValue(ingredientValue.id, ingredientValue.value, this.mapToNutrient(ingredientValue.nutrient));
    }

    protected mapToNutrient(nutrient: any): Nutrient {
        return new Nutrient(nutrient.id, nutrient.name, nutrient.description, nutrient.code, nutrient.abbreviation, nutrient.unit, nutrient.sortOrder);
    }

    protected mapToPayment(payment: any): Payment {
        return new Payment(payment.amount, payment.assigned, payment.currency, payment.paid, payment.paidTimestamp ? new Date(parseInt(payment.paidTimestamp, undefined)) : null, payment.paymentId, payment.period, payment.paymentUri, payment.subscription);
    }

    protected mapToSuggestedValue(suggestedValue: any, dietGroup: DietGroup): SuggestedValue {
        return new SuggestedValue(
            suggestedValue.id,
            suggestedValue.description,
            dietGroup,
            this.mapToIngredient(suggestedValue.ingredient),
            suggestedValue.minimum,
            suggestedValue.maximum,
        );
    }

    protected mapToUser(user: any): User {
        return new User(
            user.email,
            user.displayName,
            user.verified,
            user.picture,
            user.isSuperAdmin,
            user.locale,
            user.country,
        );
    }
}
