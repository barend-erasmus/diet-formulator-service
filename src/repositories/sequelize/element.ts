// // Imports
// import { IElementRepository } from './../element';
// import { BaseRepository } from './base';

// // Imports models
// import { Element } from './../../entities/element';

// export class ElementRepository extends BaseRepository implements IElementRepository {

//     constructor(host: string, username: string, password: string) {
//         super(host, username, password);
//     }

//     public async create(pageId: number, element: Element): Promise<Element> {
//         const result: any = await BaseRepository.models.Elements.create({
//             choices: element.choices ? element.choices.map((choice) => {
//                 return {
//                     order: choice.order,
//                     text: choice.text,
//                     value: choice.value,
//                 };
//             }) : [],
//             description: element.description,
//             maxRateDescription: null,
//             minRateDescription: null,
//             name: element.name,
//             order: element.order,
//             pageId,
//             title: element.title,
//             type: element.type,
//         }, {
//                 include: [
//                     { model: BaseRepository.models.Choices },
//                 ],
//             });

//         element.identifier = result.id;

//         return element;
//     }

//     public async delete(element: Element): Promise<Element> {

//         const result: any = await BaseRepository.models.Elements.find({
//             where: {
//                 id: element.identifier,
//             },
//         });

//         await result.destroy();

//         return element;
//     }

//     public async update(element: Element): Promise<Element> {
//         await BaseRepository.models.Choices.destroy({
//             where: {
//                 elementId: element.identifier,
//             },
//         });

//         if (element.choices) {
//             await BaseRepository.models.Choices.bulkCreate(element.choices.map((choice) => {
//                 return {
//                     elementId: element.identifier,
//                     order: choice.order,
//                     text: choice.text,
//                     value: choice.value,
//                 };
//             }));
//         }

//         const existingElement: any = await BaseRepository.models.Elements.find({
//             where: {
//                 id: element.identifier,
//             },
//         });

//         existingElement.choicesOrder = element.choicesOrder;
//         existingElement.description = element.description;
//         existingElement.inputType = element.inputType;
//         existingElement.isRequired = element.isRequired;
//         existingElement.name = element.name;
//         existingElement.order = element.order;
//         existingElement.placeHolder = element.placeHolder;
//         existingElement.rateMax = element.rateMax;
//         existingElement.rateMin = element.rateMin;
//         existingElement.rateStep = element.rateStep;
//         existingElement.title = element.title;
//         existingElement.type = element.type;

//         await existingElement.save();

//         return element;
//     }
// }
