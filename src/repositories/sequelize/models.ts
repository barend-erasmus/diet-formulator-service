import * as Sequelize from 'sequelize';

export class Models {
    public static define(sequelize: Sequelize.Sequelize): {
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
    } {
        const UserModel = sequelize.define('user', {
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

        const SubscriptionModel = sequelize.define('subscription', {
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

        const PaymentModel = sequelize.define('payment', {
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

        const PaymentNotificationModel = sequelize.define('paymentNotification', {
            paymentId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            status: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const NutrientModel = sequelize.define('nutrient', {
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

        const DietGroupModel = sequelize.define('dietGroup', {
            description: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const DietModel = sequelize.define('diet', {
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

        const DietValueModel = sequelize.define('dietValue', {
            maximum: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
            minimum: {
                allowNull: true,
                type: Sequelize.FLOAT,
            },
        });

        const IngredientGroupModel = sequelize.define('ingredientGroup', {
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const IngredientModel = sequelize.define('ingredient', {
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

        const IngredientValueModel = sequelize.define('ingredientValue', {
            value: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
        });

        const SupplementModel = sequelize.define('supplement', {

        });

        const SuggestedValueModel = sequelize.define('suggestedValue', {
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

        const ComparisonDietModel = sequelize.define('comparisonDiet', {

        });

        const FormulationModel = sequelize.define('formulation', {
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

        const FormulationIngredientModel = sequelize.define('formulationIngredient', {
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

        return {
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
}
