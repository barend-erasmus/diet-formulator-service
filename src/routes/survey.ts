// // Imports
// import * as express from 'express';
// import { config } from './../config';

// // Imports repositories
// import { ElementRepository } from './../repositories/sequelize/element';
// import { PageRepository } from './../repositories/sequelize/page';
// import { ResponseRepository } from './../repositories/sequelize/response';
// import { SurveyRepository } from './../repositories/sequelize/survey';

// // Imports services
// import { StatisticsService } from './../services/statistics';
// import { SurveyService } from './../services/survey';

// // Imports models
// import { Choice } from '../entities/choice';
// import { Element } from '../entities/element';
// import { Page } from '../entities/page';
// import { Survey } from './../entities/survey';
// import { Response } from './../entities/response';

// export class SurveyRouter {

//     public static async create(req: express.Request, res: express.Response) {
       
//     }

//     protected static getSurveyService(): SurveyService {

//         const elementRepository: ElementRepository = new ElementRepository(config.database.host, config.database.username, config.database.password);
//         const pageyRepository: PageRepository = new PageRepository(config.database.host, config.database.username, config.database.password);
//         const responseRepository: ResponseRepository = new ResponseRepository(config.database.host, config.database.username, config.database.password);
//         const surveyRepository: SurveyRepository = new SurveyRepository(config.database.host, config.database.username, config.database.password);

//         const surveyService: SurveyService = new SurveyService(elementRepository, pageyRepository, responseRepository, surveyRepository);

//         return surveyService;
//     }
// }
