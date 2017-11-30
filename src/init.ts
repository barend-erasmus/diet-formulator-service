import { BaseRepository } from "./repositories/sequelize/base";
import { config } from './config';


const baseRepository = new BaseRepository(config.database.host, config.database.username, config.database.password);

baseRepository.sync().then(() => {
    baseRepository.close();
}).catch((err) => {
    console.error(err);
})