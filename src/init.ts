import { config } from './config';
import { ApplicationRepository } from "./repositories/sequelize/application";
import { BaseRepository } from "./repositories/sequelize/base";

const baseRepository = new BaseRepository(config.database.host, config.database.username, config.database.password);

baseRepository.sync().then(() => {
    const applicationRepository = new ApplicationRepository(config.database.host, config.database.username, config.database.password);

    return applicationRepository.create('World of Rations Suite', 'Hello World');
}).then(() => {
    baseRepository.close();
}).catch((err) => {
    console.error(err);
});
