import 'reflect-metadata';
import { Container } from 'inversify';
import { IDietGroupRepository } from './repositories/diet-group';
import { DietGroupRepository } from './repositories/sequelize/diet-group';
import { IFormulationRepository } from './repositories/formulation';
import { DietRepository } from './repositories/sequelize/diet';
import { IDietRepository } from './repositories/diet';
import { FormulationRepository } from './repositories/sequelize/formulation';

const container: Container = new Container();

container.bind<IDietGroupRepository>('IDietGroupRepository').to(DietGroupRepository);
container.bind<IDietRepository>('IDietRepository').to(DietRepository);
container.bind<IFormulationRepository>('IFormulationRepository').to(FormulationRepository);

export {
    container,
};