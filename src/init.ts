import { BaseRepository } from './repositories/sequelize/base';
import { Importer } from './repositories/sequelize/importer';
import { container } from './ioc';

const baseRepository = container.get<BaseRepository>('BaseRepository');

baseRepository.sync().then(() => {
    baseRepository.dispose();

    const importer: Importer = container.get<Importer>('Importer');

    return importer.import();
}).catch((err) => {
    console.error(err);
});
