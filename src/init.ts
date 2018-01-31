import { config } from './config';
import { BaseRepository } from "./repositories/sequelize/base";

const baseRepository = new BaseRepository(config.database.host, config.database.username, config.database.password);

baseRepository.sync().catch((err) => {
    console.error(err);
});
