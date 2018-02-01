import { config } from './config';
import { BaseRepository } from "./repositories/sequelize/base";

const baseRepository = new BaseRepository(config.database.host, config.database.username, config.database.password);

baseRepository.sync().then(() => {
    baseRepository.dispose();
}).catch((err) => {
    console.error(err);
});
