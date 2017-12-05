import { SuggestedValue } from "../entities/suggested-value";

export interface ISuggestedValueRepository {
    create(suggestedValue: SuggestedValue): Promise<SuggestedValue>;
}
