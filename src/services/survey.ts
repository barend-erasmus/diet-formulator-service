// // Imports
// import { config } from './../config';

// // Imports repositories
// import { IElementRepository } from './../repositories/element';
// import { IPageRepository } from './../repositories/page';
// import { IResponseRepository } from './../repositories/response';
// import { ISurveyRepository } from './../repositories/survey';

// // Imports models
// import { Answer } from '../entities/answer';
// import { Element } from './../entities/element';
// import { Page } from './../entities/page';
// import { Response } from './../entities/response';
// import { Survey } from './../entities/survey';

// export class SurveyService {

//     constructor(
//         private elementRepository: IElementRepository,
//         private pageRepository: IPageRepository,
//         private responseRepository: IResponseRepository,
//         private surveyRepository: ISurveyRepository,
//     ) {

//     }

//     public async create(
//         profileId: string,
//         survey: Survey,
//     ): Promise<Survey> {

//         survey.profileId = profileId;

//         survey = await this.surveyRepository.create(survey);

//         return survey;
//     }

//     public async find(profileId: string, surveyId: number, validateProfileId: boolean): Promise<Survey> {
//         const survey: Survey = await this.surveyRepository.find(surveyId);

//         if (validateProfileId && survey.profileId !== profileId) {
//             return null;
//         }

//         return survey;
//     }

//     public async list(profileId: string): Promise<Survey[]> {
//         return this.surveyRepository.list(profileId);
//     }

//     public async response(surveyId: number, profileId: string, data: {}): Promise<Response> {

//         const survey: Survey = await this.surveyRepository.find(surveyId);

//         const elements: Element[] = [].concat.apply([], survey.pages.map((page) => {
//             return page.elements;
//         }));

//         const response: Response = new Response([], profileId);

//         for (const key of Object.keys(data)) {

//             const element: Element = elements.find((x) => x.name === key);

//             if (typeof (data[key]) === 'string') {
//                 response.answers.push(new Answer(element, data[key]));
//             }  else if (typeof (data[key]) === 'boolean') {
//                 response.answers.push(new Answer(element, data[key].toString()));
//             } else {
//                 for (const value of data[key]) {
//                     response.answers.push(new Answer(element, value));
//                 }
//             }
//         }

//         await this.responseRepository.create(surveyId, response);

//         return response;
//     }

//     public async responses(surveyId: number): Promise<Response[]> {

//         const responses: Response[] = await this.responseRepository.list(surveyId);

//         return responses;
//     }

//     public async update(
//         profileId: string,
//         survey: Survey,
//     ): Promise<Survey> {

//         survey.profileId = profileId;

//         const existingSurvey: Survey = await this.surveyRepository.find(survey.identifier);

//         for (const existingPage of existingSurvey.pages) {
//             if (!survey.pages.find((page) => page.identifier === existingPage.identifier)) {
//                 await this.pageRepository.delete(existingPage);
//             } else {
//                 for (const existingElement of existingPage.elements) {
//                     if (!survey.pages.find((page) => page.identifier === existingPage.identifier).elements.find((element) => element.identifier === existingElement.identifier)) {
//                         await this.elementRepository.delete(existingElement);
//                     }
//                 }
//             }
//         }

//         for (const page of survey.pages) {
//             if (!page.identifier) {
//                 await this.pageRepository.create(survey.identifier, page);
//             } else {
//                 await this.pageRepository.update(page);

//                 for (const element of page.elements) {
//                     if (!element.identifier) {
//                         await this.elementRepository.create(page.identifier, element);
//                     } else {
//                         await this.elementRepository.update(element);
//                     }
//                 }
//             }
//         }

//         await this.surveyRepository.update(survey);

//         return survey;
//     }
// }
