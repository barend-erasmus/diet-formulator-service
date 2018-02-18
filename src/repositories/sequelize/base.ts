import * as Sequelize from 'sequelize';
import * as winston from 'winston';
import { User } from '../../entities/user';
import { SuggestedValue } from '../../entities/suggested-value';
import { DietGroup } from '../../entities/diet-group';
import { Ingredient } from '../../entities/ingredient';
import { IngredientGroup } from '../../entities/ingredient-group';
import { Payment } from '../../entities/payment';
import { Nutrient } from '../../entities/nutrient';
import { IngredientValue } from '../../entities/ingredient-value';

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

    private static defineModels(): void {

        const User = BaseRepository.sequelize.define('user', {
            country: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            displayName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            expiryTimestamp: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            isSuperAdmin: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            locale: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            picture: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            token: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            verified: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
        });

        const Subscription = BaseRepository.sequelize.define('subscription', {
            active: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            expiryTimestamp: {
                allowNull: true,
                type: Sequelize.NUMERIC,
            },
            startTimestamp: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            userName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Payment = BaseRepository.sequelize.define('payment', {
            amount: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            assigned: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            currency: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            paid: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            paidTimestamp: {
                allowNull: true,
                type: Sequelize.NUMERIC,
            },
            paymentId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            paymentUri: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            period: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            subscription: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            userName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const PaymentNotification = BaseRepository.sequelize.define('paymentNotification', {
            paymentId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            status: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Nutrient = BaseRepository.sequelize.define('nutrient', {
            abbreviation: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            code: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            sortOrder: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            unit: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const DietGroup = BaseRepository.sequelize.define('dietGroup', {
            description: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Diet = BaseRepository.sequelize.define('diet', {
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            userName: {
                allowNull: true,
                type: Sequelize.STRING,
            },
        });

        const DietValue = BaseRepository.sequelize.define('dietValue', {
            maximum: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
            minimum: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
        });

        const IngredientGroup = BaseRepository.sequelize.define('ingredientGroup', {
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const Ingredient = BaseRepository.sequelize.define('ingredient', {
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            userName: {
                allowNull: true,
                type: Sequelize.STRING,
            },
        });

        const IngredientValue = BaseRepository.sequelize.define('ingredientValue', {
            value: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
        });

        const Supplement = BaseRepository.sequelize.define('supplement', {

        });

        const SuggestedValue = BaseRepository.sequelize.define('suggestedValue', {
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            maximum: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
            minimum: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
        });

        const ComparisonDiet = BaseRepository.sequelize.define('comparisonDiet', {

        });

        const Formulation = BaseRepository.sequelize.define('formulation', {
            cost: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            feasible: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            mixWeight: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            timestamp: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            userName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const FormulationIngredient = BaseRepository.sequelize.define('formulationIngredient', {
            cost: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            maximum: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
            minimum: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
        });

        DietGroup.hasMany(DietGroup, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
        DietGroup.belongsTo(DietGroup, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

        DietGroup.hasMany(Diet, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Diet.belongsTo(DietGroup, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Diet.hasMany(DietValue, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        DietValue.belongsTo(Diet, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Nutrient.hasMany(DietValue, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        DietValue.belongsTo(Nutrient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        IngredientGroup.hasMany(Ingredient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Ingredient.belongsTo(IngredientGroup, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Ingredient.hasMany(IngredientValue, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        IngredientValue.belongsTo(Ingredient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Nutrient.hasMany(IngredientValue, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        IngredientValue.belongsTo(Nutrient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Nutrient.hasMany(Supplement, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Supplement.belongsTo(Nutrient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Ingredient.hasMany(Supplement, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Supplement.belongsTo(Ingredient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        DietGroup.hasMany(SuggestedValue, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        SuggestedValue.belongsTo(DietGroup, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Ingredient.hasMany(SuggestedValue, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        SuggestedValue.belongsTo(Ingredient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Diet.hasMany(ComparisonDiet, { foreignKey: 'dietId', onDelete: 'CASCADE' });
        ComparisonDiet.belongsTo(Diet, { foreignKey: 'dietId', onDelete: 'CASCADE' });

        Diet.hasMany(ComparisonDiet, { foreignKey: 'comparisonDietId', onDelete: 'CASCADE' });
        ComparisonDiet.belongsTo(Diet, { foreignKey: 'comparisonDietId', onDelete: 'CASCADE' });

        Formulation.hasMany(FormulationIngredient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        FormulationIngredient.belongsTo(Formulation, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Ingredient.hasMany(FormulationIngredient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        FormulationIngredient.belongsTo(Ingredient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Diet.hasMany(Formulation, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Formulation.belongsTo(Diet, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        BaseRepository.models = {
            ComparisonDiet,
            Diet,
            DietGroup,
            DietValue,
            Formulation,
            FormulationIngredient,
            Ingredient,
            IngredientGroup,
            IngredientValue,
            Nutrient,
            Payment,
            PaymentNotification,
            Subscription,
            SuggestedValue,
            Supplement,
            User,
        };
    }

    constructor(private host: string, private userName: string, private password: string) {

        if (!BaseRepository.sequelize) {

            const logger = new (winston.Logger)({
                transports: [
                    new (winston.transports.File)({ filename: 'sql.log' }),
                ],
            });

            BaseRepository.sequelize = new Sequelize('diet-formulator-2018', userName, password, {
                dialect: 'postgres',
                host,
                // logging: false,
                logging: (text: string) => {
                    if (!text.startsWith('Executing (default): SELECT')) {
                        logger.info(text.substring('Executing (default): '.length, text.length));
                    }
                },
                pool: {
                    idle: 10000,
                    max: 5,
                    min: 0,
                },
            });

            BaseRepository.defineModels();
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

            const result: any = await BaseRepository.models.DietGroup.find({
                where: {
                    id: {
                        [Sequelize.Op.eq]: dietGroup.parent.id,
                    },
                },
            });

            const parent: DietGroup = this.mapToDietGroup(result);

            dietGroup.parent = await this.loadDietGroupParent(parent);
        }

        return dietGroup;
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
