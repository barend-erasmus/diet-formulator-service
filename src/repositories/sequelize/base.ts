import * as fs from 'fs';
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static models: {
        Application: Sequelize.Model<{}, {}>,
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
            packageClass: {
                allowNull: false,
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

        const Application = BaseRepository.sequelize.define('application', {
            description: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            name: {
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
            username: {
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
            username: {
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
            username: {
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

        Application.hasMany(Nutrient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Nutrient.belongsTo(Application, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Application.hasMany(DietGroup, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        DietGroup.belongsTo(Application, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Application.hasMany(IngredientGroup, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        IngredientGroup.belongsTo(Application, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

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

        this.models = {
            Application,
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
            SuggestedValue,
            Supplement,
            User,
        };
    }

    constructor(private host: string, private username: string, private password: string) {

        if (!BaseRepository.sequelize) {
            BaseRepository.sequelize = new Sequelize('diet-formulator', username, password, {
                dialect: 'postgres',
                host,
                logging: false,
                // logging: (text: string) => {
                //     if (text.startsWith('Executing (default): INSERT')) {
                //         fs.appendFileSync('importer-logs.sql', `${text.substring('Executing (default): '.length, text.length - ' RETURNING *;'.length)}; \r\n`);
                //     }
                // },
                pool: {
                    idle: 10000,
                    max: 5,
                    min: 0,
                },
            });

            BaseRepository.defineModels();
        }
    }

    public close(): void {
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
}
