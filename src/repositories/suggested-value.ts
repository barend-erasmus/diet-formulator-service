import { SuggestedValue } from '../entities/suggested-value';
import { IBaseRepository } from './base';

export interface ISuggestedValueRepository extends IBaseRepository {
    create(suggestedValue: SuggestedValue): Promise<SuggestedValue>;
    find(dietGroupId: number, ingredientId: number): Promise<SuggestedValue>;
    findById(suggestedValueId: number): Promise<SuggestedValue>;
    list(): Promise<SuggestedValue[]>;
    remove(suggestedValueId: number): Promise<void>;
    update(suggestedValue: SuggestedValue): Promise<SuggestedValue>;
}
