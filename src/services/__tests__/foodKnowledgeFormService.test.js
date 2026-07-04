import { describe, expect, it } from 'vitest';
import {
  applyFoodKnowledgeDefaults,
  createEmptyFoodFormState,
  createFoodFormDefaults,
  resolveFoodKnowledgeMatch,
} from '../foodKnowledgeFormService.js';

describe('foodKnowledgeFormService', () => {
  it('creates an empty form scaffold with a fallback category', () => {
    const form = createEmptyFoodFormState('Dairy');

    expect(form).toMatchObject({
      name: '',
      expiryDate: '',
      category: 'Dairy',
      quantity: '1',
      unit: '',
      matchedFoodId: '',
      matchedFoodName: '',
    });
  });

  it('returns autocomplete suggestions for partial queries', () => {
    const lookup = resolveFoodKnowledgeMatch('mil');
    const names = lookup.suggestions.map((food) => food.name);

    expect(names).toEqual(expect.arrayContaining(['Milk', 'Millet', 'Milk Powder']));
    expect(lookup.shouldAutoPopulate).toBe(false);
    expect(lookup.hasMultipleMatches).toBe(true);
  });

  it('auto-populates on exact matches', () => {
    const lookup = resolveFoodKnowledgeMatch('milk');

    expect(lookup.shouldAutoPopulate).toBe(true);
    expect(lookup.matchedFood?.name).toBe('Milk');
  });

  it('maps a food record into editable form defaults', () => {
    const defaults = createFoodFormDefaults(resolveFoodKnowledgeMatch('milk powder').matchedFood);

    expect(defaults).toMatchObject({
      category: 'Dairy & Eggs',
      quantity: '1',
      unit: 'g',
      storageLocation: 'Refrigerator',
      matchedFoodName: 'Milk Powder',
    });
    expect(defaults.spoilageSigns).toContain('Sour smell');
  });

  it('preserves user overrides when applying knowledge defaults', () => {
    const currentForm = {
      ...createEmptyFoodFormState('Other'),
      quantity: '9',
      unit: 'box',
      pantryShelfLife: 'manual pantry value',
    };

    const nextForm = applyFoodKnowledgeDefaults(currentForm, resolveFoodKnowledgeMatch('millet').matchedFood, {
      category: false,
      quantity: true,
      unit: true,
      pantryShelfLife: true,
      refrigeratorShelfLife: false,
      freezerShelfLife: false,
      storageLocation: false,
      storageTemperature: false,
      storageTips: false,
      spoilageSigns: false,
    });

    expect(nextForm.quantity).toBe('9');
    expect(nextForm.unit).toBe('box');
    expect(nextForm.pantryShelfLife).toBe('manual pantry value');
    expect(nextForm.category).toBe('Grains, Rice & Pasta');
    expect(nextForm.matchedFoodName).toBe('Millet');
  });
});
