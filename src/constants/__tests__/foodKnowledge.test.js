import { describe, expect, it } from 'vitest';
import { STORAGE_LOCATIONS, findFoodRecommendation } from '../foodKnowledge';

describe('foodKnowledge', () => {
  it('returns null for empty or unknown product names', () => {
    expect(findFoodRecommendation('')).toBeNull();
    expect(findFoodRecommendation('pain killer')).toBeNull();
  });

  it('matches exact food names', () => {
    expect(findFoodRecommendation('milk')).toMatchObject({
      foodName: 'Milk',
      storageLocation: 'Refrigerator',
    });
  });

  it('matches food names inside product descriptions', () => {
    expect(findFoodRecommendation('raw chicken breast')).toMatchObject({
      foodName: 'Chicken',
      storageLocation: 'Refrigerator',
    });
  });

  it('supports regional aliases', () => {
    expect(findFoodRecommendation('fresh dahi')).toMatchObject({
      foodName: 'Yogurt',
      storageLocation: 'Refrigerator',
    });
  });

  it('only returns supported storage locations', () => {
    const recommendation = findFoodRecommendation('frozen peas');

    expect(STORAGE_LOCATIONS).toContain(recommendation.storageLocation);
  });
});
