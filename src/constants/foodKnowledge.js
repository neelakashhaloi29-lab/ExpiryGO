export const STORAGE_LOCATIONS = [
  'Pantry',
  'Refrigerator',
  'Deep Freezer',
  'Room Temperature',
];

export const FOOD_KNOWLEDGE_BASE = [
  {
    name: 'Milk',
    aliases: ['milk', 'whole milk', 'toned milk', 'skim milk'],
    storageLocation: 'Refrigerator',
    shelfLife: '5-7 days after opening',
    tips: 'Keep sealed on an inner refrigerator shelf. Avoid storing milk in the door where temperature changes often.',
  },
  {
    name: 'Yogurt',
    aliases: ['yogurt', 'curd', 'dahi'],
    storageLocation: 'Refrigerator',
    shelfLife: '7-14 days unopened',
    tips: 'Keep chilled and sealed. Use a clean spoon each time to reduce spoilage.',
  },
  {
    name: 'Cheese',
    aliases: ['cheese', 'cheddar', 'mozzarella', 'paneer', 'cream cheese'],
    storageLocation: 'Refrigerator',
    shelfLife: '1-4 weeks depending on type',
    tips: 'Wrap tightly after opening. Soft cheeses spoil faster than hard cheeses.',
  },
  {
    name: 'Eggs',
    aliases: ['egg', 'eggs'],
    storageLocation: 'Refrigerator',
    shelfLife: '3-5 weeks',
    tips: 'Store in the original carton on an inner shelf, not in the refrigerator door.',
  },
  {
    name: 'Chicken',
    aliases: ['chicken', 'raw chicken', 'poultry'],
    storageLocation: 'Refrigerator',
    shelfLife: '1-2 days raw',
    tips: 'Keep in a sealed container on the lowest shelf. Freeze if not cooking within two days.',
  },
  {
    name: 'Fish',
    aliases: ['fish', 'salmon', 'tuna', 'seafood', 'prawns', 'shrimp'],
    storageLocation: 'Refrigerator',
    shelfLife: '1-2 days fresh',
    tips: 'Keep very cold and sealed. Freeze immediately if you need longer storage.',
  },
  {
    name: 'Bread',
    aliases: ['bread', 'bun', 'buns', 'loaf', 'toast'],
    storageLocation: 'Room Temperature',
    shelfLife: '3-7 days',
    tips: 'Store in a dry bread box or sealed bag. Freeze sliced bread for longer storage.',
  },
  {
    name: 'Rice',
    aliases: ['rice', 'basmati', 'brown rice', 'white rice'],
    storageLocation: 'Pantry',
    shelfLife: '6-24 months dry',
    tips: 'Keep dry in an airtight container away from heat, moisture, and pests.',
  },
  {
    name: 'Flour',
    aliases: ['flour', 'atta', 'maida', 'wheat flour'],
    storageLocation: 'Pantry',
    shelfLife: '3-8 months',
    tips: 'Store airtight in a cool pantry. Refrigerate or freeze whole grain flour for longer freshness.',
  },
  {
    name: 'Pasta',
    aliases: ['pasta', 'noodles', 'spaghetti', 'macaroni'],
    storageLocation: 'Pantry',
    shelfLife: '1-2 years dry',
    tips: 'Keep dry and sealed. Cooked pasta should be refrigerated and used within a few days.',
  },
  {
    name: 'Potatoes',
    aliases: ['potato', 'potatoes', 'aloo'],
    storageLocation: 'Pantry',
    shelfLife: '2-5 weeks',
    tips: 'Store in a cool, dark, ventilated place away from onions and sunlight.',
  },
  {
    name: 'Onions',
    aliases: ['onion', 'onions'],
    storageLocation: 'Pantry',
    shelfLife: '2-3 months whole',
    tips: 'Store whole onions in a cool, dry, ventilated place. Refrigerate cut onions in a sealed container.',
  },
  {
    name: 'Tomatoes',
    aliases: ['tomato', 'tomatoes'],
    storageLocation: 'Room Temperature',
    shelfLife: '3-7 days ripe',
    tips: 'Keep uncut tomatoes at room temperature. Refrigerate only when very ripe or cut.',
  },
  {
    name: 'Bananas',
    aliases: ['banana', 'bananas'],
    storageLocation: 'Room Temperature',
    shelfLife: '2-7 days',
    tips: 'Keep at room temperature until ripe. Separate from other fruit to slow ripening.',
  },
  {
    name: 'Apples',
    aliases: ['apple', 'apples'],
    storageLocation: 'Refrigerator',
    shelfLife: '4-8 weeks',
    tips: 'Store in the crisper drawer. Keep away from leafy greens because apples release ethylene gas.',
  },
  {
    name: 'Leafy Greens',
    aliases: ['spinach', 'lettuce', 'coriander', 'cilantro', 'greens', 'palak'],
    storageLocation: 'Refrigerator',
    shelfLife: '3-7 days',
    tips: 'Keep dry, wrapped in paper towel, and stored in a ventilated bag or container.',
  },
  {
    name: 'Carrots',
    aliases: ['carrot', 'carrots'],
    storageLocation: 'Refrigerator',
    shelfLife: '3-4 weeks',
    tips: 'Store in the crisper drawer. Keep away from excess moisture unless submerged intentionally.',
  },
  {
    name: 'Frozen Vegetables',
    aliases: ['frozen vegetables', 'frozen peas', 'frozen corn', 'frozen food'],
    storageLocation: 'Deep Freezer',
    shelfLife: '8-12 months',
    tips: 'Keep frozen solid. Reseal the pack tightly to prevent freezer burn.',
  },
  {
    name: 'Ice Cream',
    aliases: ['ice cream', 'kulfi'],
    storageLocation: 'Deep Freezer',
    shelfLife: '2-4 months',
    tips: 'Keep tightly sealed and return to the freezer quickly after serving.',
  },
  {
    name: 'Canned Food',
    aliases: ['can', 'canned', 'beans can', 'tinned'],
    storageLocation: 'Pantry',
    shelfLife: '1-5 years unopened',
    tips: 'Store in a cool pantry. Do not use cans that are swollen, leaking, or badly dented.',
  },
  {
    name: 'Cooking Oil',
    aliases: ['oil', 'olive oil', 'sunflower oil', 'mustard oil'],
    storageLocation: 'Pantry',
    shelfLife: '6-12 months after opening',
    tips: 'Keep tightly capped away from sunlight, heat, and strong odors.',
  },
];

const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const findFoodRecommendation = (productName) => {
  const normalizedName = normalize(productName || '');

  if (!normalizedName) return null;

  const match = FOOD_KNOWLEDGE_BASE.find((food) =>
    food.aliases.some((alias) => {
      const normalizedAlias = normalize(alias);
      return (
        normalizedName === normalizedAlias ||
        normalizedName.includes(normalizedAlias) ||
        normalizedAlias.includes(normalizedName)
      );
    })
  );

  if (!match) return null;

  return {
    foodName: match.name,
    storageLocation: match.storageLocation,
    shelfLife: match.shelfLife,
    tips: match.tips,
  };
};
