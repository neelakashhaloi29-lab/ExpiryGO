import { describe, expect, it } from 'vitest';
import { FOOD_KNOWLEDGE_DATABASE, FOOD_REQUIRED_FIELDS } from '../../data/foodKnowledge';
import {
  findFoodByNameOrAlias,
  getAllFoods,
  getFoodById,
  getFoodKnowledgeStats,
  getFoodsByCategory,
  normalizeFoodText,
  searchFoods,
  validateFoodKnowledgeDatabase,
} from '../foodKnowledgeService';

describe('foodKnowledgeService', () => {
  it('contains at least 300 fully populated food records', () => {
    expect(FOOD_KNOWLEDGE_DATABASE.length).toBeGreaterThanOrEqual(300);

    FOOD_KNOWLEDGE_DATABASE.forEach((food) => {
      FOOD_REQUIRED_FIELDS.forEach((field) => {
        expect(food).toHaveProperty(field);
      });

      expect(food.aliases.length).toBeGreaterThan(0);
      expect(food.defaultQuantity).toBeGreaterThan(0);
      expect(food.quantityUnits).toContain(food.defaultUnit);
      expect(food.storageTips.length).toBeGreaterThan(10);
      expect(food.spoilageSigns.length).toBeGreaterThan(0);
      expect(typeof food.canFreeze).toBe('boolean');
      expect(typeof food.canRefreeze).toBe('boolean');
    });
  });

  it('validates database integrity', () => {
    expect(validateFoodKnowledgeDatabase()).toEqual({
      isValid: true,
      duplicateIds: [],
      invalidFoods: [],
      totalFoods: FOOD_KNOWLEDGE_DATABASE.length,
    });
  });

  it('returns immutable caller-safe category result arrays', () => {
    const fruits = getFoodsByCategory('Fruits');
    const originalLength = getFoodsByCategory('Fruits').length;

    fruits.pop();

    expect(getFoodsByCategory('Fruits')).toHaveLength(originalLength);
  });

  it('builds useful stats for future database scaling', () => {
    const stats = getFoodKnowledgeStats();

    expect(stats.totalFoods).toBe(getAllFoods().length);
    expect(stats.totalCategories).toBeGreaterThanOrEqual(10);
    expect(stats.totalAliases).toBeGreaterThan(stats.totalFoods);
  });

  it('finds foods by id, name, aliases, and descriptive phrases', () => {
    expect(getFoodById('basmati-rice').name).toBe('Basmati Rice');
    expect(findFoodByNameOrAlias('dhaniya').name).toBe('Coriander Leaves');
    expect(findFoodByNameOrAlias('fresh raw chicken breast').name).toBe('Chicken Breast');
  });

  it('searches foods with ranking and category filtering', () => {
    expect(searchFoods('white rice', { limit: 5 }).map((food) => food.name)).toContain('White Rice');
    expect(searchFoods('rice', { limit: 5 })).toHaveLength(5);
    expect(searchFoods('rice', { category: 'Fruits' })).toEqual([]);
  });

  it('normalizes punctuation and case consistently', () => {
    expect(normalizeFoodText('  Fish & Chips!! ')).toBe('fish and chips');
  });
});
