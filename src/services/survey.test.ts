// import { expect } from 'chai';
// import 'mocha';

// // Imports repositories
// import { SurveyRepository } from './../repositories/memory/survey';

// // Imports services
// import { SurveyService } from './survey';
// import { Survey } from '../entities/survey';

// describe('SurveyService', () => {
//     describe('find', () => {
//         it('should return null given valid profile id, survey id not does exist and validate profile id is true', async () => {
//             const surveyService: SurveyService = new SurveyService(null, null, null, new SurveyRepository());

//             const survey = await surveyService.find('profile-id', 1, false);

//             expect(survey).to.be.null;
//         });

//         it('should return null given invalid profile id, survey id does exist and validate profile id is true', async () => {
//             const surveyService: SurveyService = new SurveyService(null, null, null, new SurveyRepository());

//             let survey: Survey = await surveyService.create('profile-id', new Survey(
//                 null,
//                 null,
//                 null,
//                 null,
//                 [],
//                 null,
//                 null,
//                 null,
//                 null,
//             ));

//             survey = await surveyService.find('invalid-profile-id', survey.identifier, true);

//             expect(survey).to.be.null;
//         });

//         it('should return survey given valid profile id, survey id does exist and validate profile id is true', async () => {
//             const surveyService: SurveyService = new SurveyService(null, null, null, new SurveyRepository());

//             let survey: Survey = await surveyService.create('profile-id', new Survey(
//                 null,
//                 null,
//                 null,
//                 null,
//                 [],
//                 null,
//                 null,
//                 null,
//                 null,
//             ));

//             survey = await surveyService.find('profile-id', survey.identifier, true);

//             expect(survey).to.be.not.null;
//         });

//         it('should return survey given invalid profile id, survey id does exist and validate profile id is false', async () => {
//             const surveyService: SurveyService = new SurveyService(null, null, null, new SurveyRepository());

//             let survey: Survey = await surveyService.create('profile-id', new Survey(
//                 null,
//                 null,
//                 null,
//                 null,
//                 [],
//                 null,
//                 null,
//                 null,
//                 null,
//             ));

//             survey = await surveyService.find('invalid-profile-id', survey.identifier, false);

//             expect(survey).to.be.not.null;
//         });

//     });
// });