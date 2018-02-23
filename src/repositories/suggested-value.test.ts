import { expect } from 'chai';
import 'mocha';
import { SuggestedValue } from '../entities/suggested-value';
import { configureForTesting, container } from '../ioc';
import { ISuggestedValueRepository } from './suggested-value';

describe('SuggestedValueRepository - Integration', () => {

    let suggestedValueRepository: ISuggestedValueRepository = null;

    before(async () => {
        configureForTesting();
        suggestedValueRepository = container.get<ISuggestedValueRepository>('ISuggestedValueRepository');
    });

    after(async () => {
        suggestedValueRepository.dispose();
        suggestedValueRepository = null;
    });

    describe('find', () => {

        it('should return suggested value', async () => {

            const result: SuggestedValue = await suggestedValueRepository.find(46, 153);

            expect(result).to.be.not.null;

        });

        it('should return suggested value with diet group', async () => {

            const result: SuggestedValue = await suggestedValueRepository.find(46, 153);

            expect(result.dietGroup).to.be.not.null;

        });

        it('should return suggested value with diet group with parent', async () => {

            const result: SuggestedValue = await suggestedValueRepository.find(46, 153);

            expect(result.dietGroup.parent).to.be.not.null;

        });

        it('should return suggested value with ingredient', async () => {

            const result: SuggestedValue = await suggestedValueRepository.find(46, 153);

            expect(result.ingredient).to.be.not.null;

        });

        it('should return suggested value with ingredient with group', async () => {

            const result: SuggestedValue = await suggestedValueRepository.find(46, 153);

            expect(result.ingredient.group).to.be.not.null;

        });

        it('should return suggested value with ingredient with ingredient values', async () => {

            const result: SuggestedValue = await suggestedValueRepository.find(46, 153);

            expect(result.ingredient.values.length).to.gt(0);

        });

        it('should return suggested value with ingredient with ingredient values with nutrient', async () => {

            const result: SuggestedValue = await suggestedValueRepository.find(46, 153);

            expect(result.ingredient.values[0]).to.be.not.null;

        });

    });

    describe('findById', () => {

        it('should return suggested value', async () => {

            const result: SuggestedValue = await suggestedValueRepository.findById(1);

            expect(result).to.be.not.null;

        });

        it('should return suggested value with diet group', async () => {

            const result: SuggestedValue = await suggestedValueRepository.findById(1);

            expect(result.dietGroup).to.be.not.null;

        });

        it('should return suggested value with diet group with parent', async () => {

            const result: SuggestedValue = await suggestedValueRepository.findById(1);

            expect(result.dietGroup.parent).to.be.not.null;

        });

        it('should return suggested value with ingredient', async () => {

            const result: SuggestedValue = await suggestedValueRepository.findById(1);

            expect(result.ingredient).to.be.not.null;

        });

        it('should return suggested value with ingredient with group', async () => {

            const result: SuggestedValue = await suggestedValueRepository.findById(1);

            expect(result.ingredient.group).to.be.not.null;

        });

        it('should return suggested value with ingredient with ingredient values', async () => {

            const result: SuggestedValue = await suggestedValueRepository.findById(1);

            expect(result.ingredient.values.length).to.gt(0);

        });

        it('should return suggested value with ingredient with ingredient values with nutrient', async () => {

            const result: SuggestedValue = await suggestedValueRepository.findById(1);

            expect(result.ingredient.values[0]).to.be.not.null;

        });

    });

    describe('list', () => {

        it('should return list of suggested values', async () => {

            const result: SuggestedValue[] = await suggestedValueRepository.list();

            expect(result.length).to.be.gt(0);

        });

        it('should return suggested value with diet group', async () => {

            const result: SuggestedValue[] = await suggestedValueRepository.list();

            expect(result.find((suggestedValue) => suggestedValue.id === 1).dietGroup).to.be.not.null;

        });

        it('should return suggested value with diet group with parent', async () => {

            const result: SuggestedValue[] = await suggestedValueRepository.list();

            expect(result.find((suggestedValue) => suggestedValue.id === 1).dietGroup.parent).to.be.not.null;

        });

        it('should return suggested value with ingredient', async () => {

            const result: SuggestedValue[] = await suggestedValueRepository.list();

            expect(result.find((suggestedValue) => suggestedValue.id === 1).ingredient).to.be.not.null;

        });

        it('should return suggested value with ingredient with group', async () => {

            const result: SuggestedValue[] = await suggestedValueRepository.list();

            expect(result.find((suggestedValue) => suggestedValue.id === 1).ingredient.group).to.be.not.null;

        });

        it('should return suggested value with ingredient with ingredient values', async () => {

            const result: SuggestedValue[] = await suggestedValueRepository.list();

            expect(result.find((suggestedValue) => suggestedValue.id === 1).ingredient.values.length).to.gt(0);

        });

        it('should return suggested value with ingredient with ingredient values with nutrient', async () => {

            const result: SuggestedValue[] = await suggestedValueRepository.list();

            expect(result.find((suggestedValue) => suggestedValue.id === 1).ingredient.values[0]).to.be.not.null;

        });

    });
});
