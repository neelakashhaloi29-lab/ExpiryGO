import { FOOD_KNOWLEDGE_DATABASE } from '../data/foodKnowledge/foods.js';
import { validateFoodRecord } from '../data/foodKnowledge/schema.js';

export const normalizeFoodText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const createFoodIndexes = (foods) => {
  const byId = new Map();
  const byAlias = new Map();
  const byCategory = new Map();

  foods.forEach((food) => {
    byId.set(food.id, food);

    [food.name, ...food.aliases].forEach((alias) => {
      const normalizedAlias = normalizeFoodText(alias);
      if (normalizedAlias && !byAlias.has(normalizedAlias)) {
        byAlias.set(normalizedAlias, food);
      }
    });

    const categoryFoods = byCategory.get(food.category) || [];
    categoryFoods.push(food);
    byCategory.set(food.category, categoryFoods);
  });

  return { byId, byAlias, byCategory };
};

const indexes = createFoodIndexes(FOOD_KNOWLEDGE_DATABASE);

export const getAllFoods = () => FOOD_KNOWLEDGE_DATABASE;

export const getFoodKnowledgeStats = () => ({
  totalFoods: FOOD_KNOWLEDGE_DATABASE.length,
  totalCategories: indexes.byCategory.size,
  totalAliases: indexes.byAlias.size,
});

export const getFoodById = (id) => indexes.byId.get(id) || null;

export const getFoodsByCategory = (category) =>
  [...(indexes.byCategory.get(category) || [])].sort((a, b) => a.name.localeCompare(b.name));

export const findFoodByNameOrAlias = (query) => {
  const normalizedQuery = normalizeFoodText(query);
  if (!normalizedQuery) return null;

  const exactMatch = indexes.byAlias.get(normalizedQuery);
  if (exactMatch) return exactMatch;

  return (
    FOOD_KNOWLEDGE_DATABASE.find((food) =>
      [food.name, ...food.aliases].some((alias) => {
        const normalizedAlias = normalizeFoodText(alias);
        return (
          normalizedAlias === normalizedQuery ||
          normalizedQuery.includes(normalizedAlias) ||
          normalizedAlias.includes(normalizedQuery)
        );
      })
    ) || null
  );
};

export const searchFoods = (query, { limit = 20, category } = {}) => {
  const normalizedQuery = normalizeFoodText(query);
  if (!normalizedQuery) return [];

  const sourceFoods = category ? indexes.byCategory.get(category) || [] : FOOD_KNOWLEDGE_DATABASE;

  return sourceFoods
    .map((food) => {
      const searchableTerms = [food.name, ...food.aliases].map(normalizeFoodText);
      const score = searchableTerms.reduce((bestScore, term) => {
        if (term === normalizedQuery) return Math.max(bestScore, 100);
        if (term.startsWith(normalizedQuery)) return Math.max(bestScore, 80);
        if (term.includes(normalizedQuery)) return Math.max(bestScore, 60);
        if (normalizedQuery.includes(term)) return Math.max(bestScore, 40);
        return bestScore;
      }, 0);

      return { food, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))
    .slice(0, limit)
    .map((result) => result.food);
};

export const validateFoodKnowledgeDatabase = (foods = FOOD_KNOWLEDGE_DATABASE) => {
  const ids = new Set();
  const duplicateIds = [];
  const invalidFoods = [];

  foods.forEach((food) => {
    if (ids.has(food.id)) {
      duplicateIds.push(food.id);
    }
    ids.add(food.id);

    if (!validateFoodRecord(food)) {
      invalidFoods.push(food.id || food.name || 'unknown');
    }
  });

  return {
    isValid: duplicateIds.length === 0 && invalidFoods.length === 0,
    duplicateIds,
    invalidFoods,
    totalFoods: foods.length,
  };
};
