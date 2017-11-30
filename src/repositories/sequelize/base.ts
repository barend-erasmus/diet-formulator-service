// Imports
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static models: {
        DietGroup: Sequelize.Model<{}, {}>,
        Diet: Sequelize.Model<{}, {}>,
    } = null;
    protected static sequelize: Sequelize.Sequelize = null;

    private static defineModels(): void {

        const DietGroup = BaseRepository.sequelize.define('dietGroup', {
            description: {
                allowNull: true,
                type: Sequelize.STRING,
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
        });

        const Nutrient = BaseRepository.sequelize.define('nutrient', {
            abbreviation: {
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
        });

        const DietValues = BaseRepository.sequelize.define('dietValues', {
            unit: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            value: {
                allowNull: false,
                type: Sequelize.FLOAT,
            },
        });


        DietGroup.hasMany(DietGroup, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
        DietGroup.belongsTo(DietGroup, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

        DietGroup.hasMany(Diet, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Diet.belongsTo(DietGroup, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Diet.hasMany(DietValues, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        DietValues.belongsTo(Diet, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        Nutrient.hasMany(DietValues, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        DietValues.belongsTo(Nutrient, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        this.models = {
            DietGroup,
            Diet,
        };
    }

    constructor(private host: string, private username: string, private password: string) {

        if (!BaseRepository.sequelize) {
            BaseRepository.sequelize = new Sequelize('diet-formulator', username, password, {
                dialect: 'postgres',
                host,
                logging: false,
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
        BaseRepository.sequelize.close();
    }

    public sync(): Promise<void> {
        return new Promise((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }
}
