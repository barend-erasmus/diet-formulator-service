import * as Sequelize from 'sequelize';
import * as winston from 'winston';
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
        const UserModel = BaseRepository.sequelize.define('user', {
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

        const SubscriptionModel = BaseRepository.sequelize.define('subscription', {
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

        const PaymentModel = BaseRepository.sequelize.define('payment', {
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

        const PaymentNotificationModel = BaseRepository.sequelize.define('paymentNotification', {
            paymentId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            status: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const NutrientModel = BaseRepository.sequelize.define('nutrient', {
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

        const DietGroupModel = BaseRepository.sequelize.define('dietGroup', {
            description: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const DietModel = BaseRepository.sequelize.define('diet', {
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

        const DietValueModel = BaseRepository.sequelize.define('dietValue', {
            maximum: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
            minimum: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
        });

        const IngredientGroupModel = BaseRepository.sequelize.define('ingredientGroup', {
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const IngredientModel = BaseRepository.sequelize.define('ingredient', {
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

        const IngredientValueModel = BaseRepository.sequelize.define('ingredientValue', {
            value: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
        });

        const SupplementModel = BaseRepository.sequelize.define('supplement', {

        });

        const SuggestedValueModel = BaseRepository.sequelize.define('suggestedValue', {
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

        const ComparisonDietModel = BaseRepository.sequelize.define('comparisonDiet', {

        });

        const FormulationModel = BaseRepository.sequelize.define('formulation', {
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

        const FormulationIngredientModel = BaseRepository.sequelize.define('formulationIngredient', {
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

        DietGroupModel.hasMany(DietGroupModel, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
        DietGroupModel.belongsTo(DietGroupModel, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

        DietGroupModel.hasMany(DietModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        DietModel.belongsTo(DietGroupModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        DietModel.hasMany(DietValueModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        DietValueModel.belongsTo(DietModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        NutrientModel.hasMany(DietValueModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        DietValueModel.belongsTo(NutrientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        IngredientGroupModel.hasMany(IngredientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        IngredientModel.belongsTo(IngredientGroupModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        IngredientModel.hasMany(IngredientValueModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        IngredientValueModel.belongsTo(IngredientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        NutrientModel.hasMany(IngredientValueModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        IngredientValueModel.belongsTo(NutrientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        NutrientModel.hasMany(SupplementModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        SupplementModel.belongsTo(NutrientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        IngredientModel.hasMany(SupplementModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        SupplementModel.belongsTo(IngredientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        DietGroupModel.hasMany(SuggestedValueModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        SuggestedValueModel.belongsTo(DietGroupModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        IngredientModel.hasMany(SuggestedValueModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        SuggestedValueModel.belongsTo(IngredientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        DietModel.hasMany(ComparisonDietModel, { foreignKey: 'dietId', onDelete: 'CASCADE' });
        ComparisonDietModel.belongsTo(DietModel, { foreignKey: 'dietId', onDelete: 'CASCADE' });

        DietModel.hasMany(ComparisonDietModel, { foreignKey: 'comparisonDietId', onDelete: 'CASCADE' });
        ComparisonDietModel.belongsTo(DietModel, { foreignKey: 'comparisonDietId', onDelete: 'CASCADE' });

        FormulationModel.hasMany(FormulationIngredientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        FormulationIngredientModel.belongsTo(FormulationModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        IngredientModel.hasMany(FormulationIngredientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        FormulationIngredientModel.belongsTo(IngredientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        DietModel.hasMany(FormulationModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        FormulationModel.belongsTo(DietModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        BaseRepository.models = {
            ComparisonDiet: ComparisonDietModel,
            Diet: DietModel,
            DietGroup: DietGroupModel,
            DietValue: DietValueModel,
            Formulation: FormulationModel,
            FormulationIngredient: FormulationIngredientModel,
            Ingredient: IngredientModel,
            IngredientGroup: IngredientGroupModel,
            IngredientValue: IngredientValueModel,
            Nutrient: NutrientModel,
            Payment: PaymentModel,
            PaymentNotification: PaymentNotificationModel,
            Subscription: SubscriptionModel,
            SuggestedValue: SuggestedValueModel,
            Supplement: SupplementModel,
            User: UserModel,
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
