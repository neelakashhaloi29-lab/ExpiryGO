import { findFoodByNameOrAlias, searchFoods } from './foodKnowledgeService.js';

export const FOOD_FORM_OVERRIDE_FIELDS = [
  'category',
  'quantity',
  'unit',
  'pantryShelfLife',
  'refrigeratorShelfLife',
  'freezerShelfLife',
  'storageLocation',
  'storageTemperature',
  'storageTips',
  'spoilageSigns',
];

export const createEmptyFoodFormState = (fallbackCategory = '') => ({
  name: '',
  expiryDate: '',
  category: fallbackCategory,
  quantity: '1',
  unit: '',
  pantryShelfLife: '',
  refrigeratorShelfLife: '',
  freezerShelfLife: '',
  storageLocation: '',
  storageTemperature: '',
  storageTips: '',
  spoilageSigns: '',
  notes: '',
  matchedFoodId: '',
  matchedFoodName: '',
});

export const createFoodOverrideState = () =>
  FOOD_FORM_OVERRIDE_FIELDS.reduce((state, field) => ({ ...state, [field]: false }), {});

export const toSpoilageSignsText = (spoilageSigns = []) => spoilageSigns.join(', ');

export const createFoodFormDefaults = (food) => {
  if (!food) return null;

  return {
    category: food.category,
    quantity: String(food.defaultQuantity ?? 1),
    unit: food.defaultUnit || '',
    pantryShelfLife: food.pantryShelfLife || '',
    refrigeratorShelfLife: food.refrigeratorShelfLife || '',
    freezerShelfLife: food.freezerShelfLife || '',
    storageLocation: food.idealStorageLocation || '',
    storageTemperature: food.idealStorageTemperature || '',
    storageTips: food.storageTips || '',
    spoilageSigns: toSpoilageSignsText(food.spoilageSigns),
    matchedFoodId: food.id,
    matchedFoodName: food.name,
  };
};

export const getFoodKnowledgeSuggestions = (query, limit = 5) =>
  searchFoods(query, { limit });

export const resolveFoodKnowledgeMatch = (query, limit = 5) => {
  const suggestions = getFoodKnowledgeSuggestions(query, limit);
  const exactMatch = findFoodByNameOrAlias(query);
  const matchedFood = exactMatch || (suggestions.length === 1 ? suggestions[0] : null);

  return {
    suggestions,
    exactMatch,
    matchedFood,
    hasMultipleMatches: suggestions.length > 1 && !exactMatch,
    shouldAutoPopulate: Boolean(matchedFood),
  };
};

export const applyFoodKnowledgeDefaults = (
  currentForm,
  food,
  overrides = createFoodOverrideState()
) => {
  if (!food) return currentForm;

  const defaults = createFoodFormDefaults(food);
  const nextForm = { ...currentForm };

  FOOD_FORM_OVERRIDE_FIELDS.forEach((field) => {
    if (!overrides[field] && defaults[field] !== undefined) {
      nextForm[field] = defaults[field];
    }
  });

  nextForm.matchedFoodId = defaults.matchedFoodId;
  nextForm.matchedFoodName = defaults.matchedFoodName;

  return nextForm;
};
