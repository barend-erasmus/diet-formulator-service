import * as path from 'path';
import { config } from './config';
import { WinstonLogger } from './loggers/winston';
import { BaseRepository } from './repositories/sequelize/base';
import { Importer } from './repositories/sequelize/importer';

const baseRepository = new BaseRepository(config.database.host, config.database.userName, config.database.password, new WinstonLogger('sql'));

baseRepository.sync().then(() => {
    baseRepository.dispose();

    return new Importer(config.database.host, 'postgres', 'i8@lltheteaspoon$', path.join(__dirname, '..', 'databases', 'world-of-rations', 'table-exports'))
    .import();
}).catch((err) => {
    console.error(err);
});
