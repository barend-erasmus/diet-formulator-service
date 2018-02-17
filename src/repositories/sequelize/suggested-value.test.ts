import { expect } from 'chai';
import 'mocha';
import { SuggestedValue } from '../../entities/suggested-value';
import { container } from '../../ioc';
import { ISuggestedValueRepository } from '../suggested-value';

describe('SuggestedValueRepository - Integration', () => {

    let suggestedValueRepository: ISuggestedValueRepository = null;

    before(async () => {
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

        it('should return suggested value with diet group parent', async () => {

            const result: SuggestedValue = await suggestedValueRepository.find(46, 153);

            expect(result.dietGroup.parent).to.be.not.null;

        });

    });

    describe('list', () => {

        it('should return list of suggested values', async () => {

            const result: SuggestedValue[] = await suggestedValueRepository.list();

            expect(result.length).to.be.gt(0);

        });

    });
});
