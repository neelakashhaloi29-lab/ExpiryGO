import { createFoodRecord } from './schema.js';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const parseEntry = (entry) => {
  if (typeof entry === 'string') {
    return { name: entry, aliases: [] };
  }

  const [name, aliases = [], overrides = {}] = entry;
  return { name, aliases, overrides };
};

const expandGroup = ({
  category,
  profile,
  defaultUnit,
  quantityUnits,
  icon,
  entries,
}) =>
  entries.map((entry) => {
    const { name, aliases, overrides = {} } = parseEntry(entry);

    return createFoodRecord({
      id: slugify(name),
      name,
      aliases: [name.toLowerCase(), ...aliases],
      category,
      defaultUnit,
      quantityUnits,
      icon,
      profile,
      ...overrides,
    });
  });

const FOOD_GROUPS = [
  {
    category: 'Fruits',
    profile: 'freshFruit',
    defaultUnit: 'piece',
    quantityUnits: ['piece', 'g', 'kg', 'cup'],
    icon: 'fruit',
    entries: [
      'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry', 'Boysenberry',
      'Cantaloupe', 'Cherry', 'Clementine', 'Coconut', 'Cranberry', 'Date', 'Dragon Fruit',
      'Durian', 'Fig', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava', 'Honeydew Melon',
      'Jackfruit', 'Jujube', 'Kiwi', 'Kumquat', 'Lemon', 'Lime', 'Longan', 'Lychee',
      'Mandarin Orange', 'Mango', 'Mangosteen', 'Mulberry', 'Nectarine', 'Orange',
      'Papaya', 'Passion Fruit', 'Peach', 'Pear', 'Persimmon', 'Pineapple', 'Plantain',
      'Plum', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Red Currant',
      'Sapodilla', 'Star Fruit', 'Strawberry', 'Tamarind', 'Tangerine', 'Watermelon',
      ['Custard Apple', ['sitaphal', 'sugar apple']],
      ['Indian Gooseberry', ['amla']],
      ['Prickly Pear', ['cactus fruit']],
      ['Soursop', ['guanabana']],
    ],
  },
  {
    category: 'Vegetables',
    profile: 'freshVegetable',
    defaultUnit: 'piece',
    quantityUnits: ['piece', 'g', 'kg', 'bunch', 'cup'],
    icon: 'vegetable',
    entries: [
      'Artichoke', 'Asparagus', 'Bamboo Shoot', 'Bean Sprout', 'Beet Greens',
      'Bell Pepper', 'Bitter Melon', 'Bok Choy', 'Broccoli', 'Broccolini',
      'Brussels Sprouts', 'Cabbage', 'Capsicum', 'Cauliflower', 'Celery',
      'Chayote', 'Collard Greens', 'Cucumber', 'Daikon', 'Drumstick',
      'Eggplant', 'Endive', 'Fennel Bulb', 'French Beans', 'Green Beans',
      'Green Chili', 'Kale', 'Kohlrabi', 'Leek', 'Lettuce', 'Lotus Root',
      'Malabar Spinach', 'Mushroom', 'Mustard Greens', 'Okra', 'Pea Shoots',
      'Radicchio', 'Radish', 'Red Cabbage', 'Romaine Lettuce', 'Snake Gourd',
      'Snow Peas', 'Spinach', 'Spring Onion', 'Swiss Chard', 'Tomatillo',
      'Tomato', 'Turnip Greens', 'Water Spinach', 'Zucchini',
      ['Coriander Leaves', ['cilantro', 'dhaniya'], { defaultUnit: 'bunch', icon: 'herb' }],
      ['Curry Leaves', ['kadi patta'], { defaultUnit: 'bunch', icon: 'herb' }],
      ['Fenugreek Leaves', ['methi'], { defaultUnit: 'bunch', icon: 'herb' }],
      ['Mint Leaves', ['pudina'], { defaultUnit: 'bunch', icon: 'herb' }],
      ['Parsley', [], { defaultUnit: 'bunch', icon: 'herb' }],
    ],
  },
  {
    category: 'Root Vegetables',
    profile: 'rootVegetable',
    defaultUnit: 'piece',
    quantityUnits: ['piece', 'g', 'kg'],
    icon: 'root-vegetable',
    entries: [
      'Beetroot', 'Carrot', 'Cassava', 'Celeriac', 'Garlic', 'Ginger', 'Jicama',
      'Onion', 'Parsnip', 'Potato', 'Purple Sweet Potato', 'Rutabaga', 'Shallot',
      'Sweet Potato', 'Taro Root', 'Turnip', 'Water Chestnut', 'Yam',
      ['Elephant Foot Yam', ['suran', 'ol']],
      ['Galangal', ['thai ginger']],
      ['Jerusalem Artichoke', ['sunchoke']],
      ['Lotus Stem', ['kamal kakdi']],
      ['Raw Turmeric', ['fresh turmeric']],
    ],
  },
  {
    category: 'Dairy & Eggs',
    profile: 'dairy',
    defaultUnit: 'pack',
    quantityUnits: ['pack', 'g', 'kg', 'ml', 'l', 'cup'],
    icon: 'dairy',
    entries: [
      'Milk', 'Buttermilk', 'Cream', 'Sour Cream', 'Whipping Cream', 'Greek Yogurt',
      'Yogurt', 'Kefir', 'Lassi', 'Curd', 'Butter', 'Ghee', 'Margarine',
      'Cottage Cheese', 'Cream Cheese', 'Ricotta', 'Mascarpone', 'Paneer',
      'Cheddar Cheese', 'Mozzarella Cheese', 'Parmesan Cheese', 'Feta Cheese',
      'Gouda Cheese', 'Brie Cheese', 'Blue Cheese', 'Processed Cheese',
      ['Eggs', ['egg'], { defaultUnit: 'piece', quantityUnits: ['piece', 'dozen'] }],
      ['Quail Eggs', ['quail egg'], { defaultUnit: 'piece', quantityUnits: ['piece', 'dozen'] }],
    ],
  },
  {
    category: 'Meat & Poultry',
    profile: 'rawMeat',
    defaultUnit: 'g',
    quantityUnits: ['g', 'kg', 'piece', 'pack'],
    icon: 'meat',
    entries: [
      'Chicken Breast', 'Chicken Thigh', 'Whole Chicken', 'Ground Chicken',
      'Turkey Breast', 'Ground Turkey', 'Duck', 'Goose', 'Quail', 'Pork Chop',
      'Pork Belly', 'Pork Ribs', 'Ground Pork', 'Bacon', 'Ham', 'Sausage',
      'Beef Steak', 'Ground Beef', 'Beef Brisket', 'Beef Ribs', 'Veal',
      'Lamb Chop', 'Ground Lamb', 'Mutton', 'Goat Meat', 'Rabbit', 'Venison',
      'Salami', 'Pepperoni', 'Chorizo',
    ],
  },
  {
    category: 'Seafood',
    profile: 'seafood',
    defaultUnit: 'g',
    quantityUnits: ['g', 'kg', 'piece', 'pack'],
    icon: 'seafood',
    entries: [
      'Salmon', 'Tuna', 'Cod', 'Haddock', 'Halibut', 'Sardines', 'Anchovies',
      'Mackerel', 'Trout', 'Tilapia', 'Catfish', 'Snapper', 'Sea Bass',
      'Pomfret', 'Rohu', 'Hilsa', 'Kingfish', 'Prawns', 'Shrimp', 'Crab',
      'Lobster', 'Scallops', 'Mussels', 'Clams', 'Oysters', 'Squid', 'Octopus',
      'Surimi', 'Smoked Salmon', 'Fish Roe',
    ],
  },
  {
    category: 'Grains, Rice & Pasta',
    profile: 'pantryStaple',
    defaultUnit: 'g',
    quantityUnits: ['g', 'kg', 'cup', 'pack'],
    icon: 'grain',
    entries: [
      'White Rice', 'Brown Rice', 'Basmati Rice', 'Jasmine Rice', 'Arborio Rice',
      'Sushi Rice', 'Wild Rice', 'Sticky Rice', 'Poha', 'Puffed Rice', 'Flattened Rice',
      'Wheat Flour', 'All Purpose Flour', 'Bread Flour', 'Cake Flour', 'Whole Wheat Flour',
      'Gram Flour', 'Rice Flour', 'Corn Flour', 'Semolina', 'Oats', 'Steel Cut Oats',
      'Rolled Oats', 'Barley', 'Buckwheat', 'Bulgur', 'Couscous', 'Millet',
      'Ragi', 'Jowar', 'Bajra', 'Quinoa', 'Amaranth', 'Polenta', 'Cornmeal',
      'Spaghetti', 'Penne', 'Macaroni', 'Fusilli', 'Rice Noodles', 'Egg Noodles',
      'Ramen Noodles', 'Soba Noodles', 'Udon Noodles', 'Vermicelli',
    ],
  },
  {
    category: 'Beans, Lentils & Soy',
    profile: 'pantryStaple',
    defaultUnit: 'g',
    quantityUnits: ['g', 'kg', 'cup', 'can', 'pack'],
    icon: 'legume',
    entries: [
      'Black Beans', 'Kidney Beans', 'Pinto Beans', 'Navy Beans', 'Cannellini Beans',
      'Chickpeas', 'Black Eyed Peas', 'Green Peas', 'Split Peas', 'Lentils',
      'Red Lentils', 'Green Lentils', 'Brown Lentils', 'Urad Dal', 'Moong Dal',
      'Toor Dal', 'Chana Dal', 'Masoor Dal', 'Soybeans', 'Edamame', 'Tofu',
      'Tempeh', 'Miso Paste', 'Soy Milk', 'Seitan',
    ],
  },
  {
    category: 'Bakery & Breads',
    profile: 'bakery',
    defaultUnit: 'piece',
    quantityUnits: ['piece', 'slice', 'loaf', 'pack', 'g'],
    icon: 'bakery',
    entries: [
      'White Bread', 'Whole Wheat Bread', 'Sourdough Bread', 'Rye Bread', 'Baguette',
      'Brioche', 'Ciabatta', 'Pita Bread', 'Naan', 'Roti', 'Paratha', 'Tortilla',
      'Lavash', 'Bagel', 'English Muffin', 'Croissant', 'Dinner Roll', 'Burger Bun',
      'Hot Dog Bun', 'Pav', 'Dosa Batter', 'Idli Batter', 'Pizza Base', 'Breadcrumbs',
    ],
  },
  {
    category: 'Condiments, Sauces & Pickles',
    profile: 'condiment',
    defaultUnit: 'bottle',
    quantityUnits: ['bottle', 'jar', 'g', 'kg', 'ml', 'l', 'tbsp', 'tsp'],
    icon: 'condiment',
    entries: [
      'Ketchup', 'Mustard', 'Mayonnaise', 'Soy Sauce', 'Fish Sauce', 'Oyster Sauce',
      'Hoisin Sauce', 'Sriracha', 'Hot Sauce', 'Barbecue Sauce', 'Worcestershire Sauce',
      'Vinegar', 'Apple Cider Vinegar', 'Balsamic Vinegar', 'Rice Vinegar',
      'Olive Oil', 'Sunflower Oil', 'Canola Oil', 'Sesame Oil', 'Mustard Oil',
      'Coconut Oil', 'Peanut Butter', 'Jam', 'Marmalade', 'Honey', 'Maple Syrup',
      'Tahini', 'Hummus', 'Salsa', 'Pesto', 'Curry Paste', 'Tomato Paste',
      'Harissa', 'Gochujang', 'Doenjang', 'Kimchi', 'Sauerkraut', 'Dill Pickles',
      'Mango Pickle', 'Lime Pickle', 'Olives', 'Capers',
    ],
  },
  {
    category: 'Beverages',
    profile: 'beverage',
    defaultUnit: 'bottle',
    quantityUnits: ['bottle', 'can', 'ml', 'l', 'pack'],
    icon: 'beverage',
    entries: [
      'Orange Juice', 'Apple Juice', 'Coconut Water', 'Lemonade', 'Iced Tea',
      'Kombucha', 'Soda', 'Sparkling Water', 'Mineral Water', 'Tonic Water',
      'Coffee Beans', 'Ground Coffee', 'Instant Coffee', 'Black Tea', 'Green Tea',
      'Herbal Tea', 'Cocoa Powder', 'Almond Milk', 'Oat Milk', 'Coconut Milk',
      'Evaporated Milk', 'Condensed Milk',
    ],
  },
  {
    category: 'Prepared Foods',
    profile: 'preparedFood',
    defaultUnit: 'pack',
    quantityUnits: ['pack', 'piece', 'g', 'kg', 'cup'],
    icon: 'prepared-food',
    entries: [
      'Cooked Rice', 'Fried Rice', 'Biryani', 'Pulao', 'Cooked Pasta', 'Lasagna',
      'Pizza', 'Soup', 'Stew', 'Chili', 'Curry', 'Dal', 'Sambar', 'Rasam',
      'Chutney', 'Sushi', 'Onigiri', 'Dumplings', 'Momos', 'Spring Rolls',
      'Tamales', 'Tacos', 'Burrito', 'Enchiladas', 'Hummus Bowl', 'Falafel',
      'Shawarma', 'Kebab', 'Meatballs', 'Roast Chicken', 'Grilled Fish',
      'Mashed Potatoes', 'Pasta Salad', 'Potato Salad', 'Coleslaw', 'Sandwich',
      'Salad', 'Cooked Beans', 'Boiled Eggs', 'Pancakes',
    ],
  },
  {
    category: 'Snacks, Nuts & Sweets',
    profile: 'snack',
    defaultUnit: 'pack',
    quantityUnits: ['pack', 'piece', 'g', 'kg', 'cup'],
    icon: 'snack',
    entries: [
      'Almonds', 'Cashews', 'Walnuts', 'Pistachios', 'Peanuts', 'Hazelnuts',
      'Pecans', 'Macadamia Nuts', 'Raisins', 'Dried Apricots', 'Dried Figs',
      'Dates', 'Trail Mix', 'Granola', 'Cereal', 'Popcorn Kernels', 'Potato Chips',
      'Tortilla Chips', 'Crackers', 'Pretzels', 'Cookies', 'Biscuits', 'Chocolate',
      'Candy', 'Marshmallows', 'Gulab Jamun', 'Rasgulla', 'Baklava', 'Mochi',
      'Rice Cakes',
    ],
  },
  {
    category: 'Frozen Foods',
    profile: 'preparedFood',
    defaultUnit: 'pack',
    quantityUnits: ['pack', 'piece', 'g', 'kg', 'cup'],
    icon: 'frozen-food',
    entries: [
      ['Frozen Peas', [], {
        pantryShelfLife: 'Keep frozen; unsafe after thawing at room temperature',
        refrigeratorShelfLife: '3-4 days after thawing',
        freezerShelfLife: '8-12 months',
        idealStorageLocation: 'Freezer',
        idealStorageTemperature: '-18 C or colder',
      }],
      ['Frozen Corn', [], {
        pantryShelfLife: 'Keep frozen; unsafe after thawing at room temperature',
        refrigeratorShelfLife: '3-4 days after thawing',
        freezerShelfLife: '8-12 months',
        idealStorageLocation: 'Freezer',
        idealStorageTemperature: '-18 C or colder',
      }],
      ['Frozen Mixed Vegetables', [], {
        pantryShelfLife: 'Keep frozen; unsafe after thawing at room temperature',
        refrigeratorShelfLife: '3-4 days after thawing',
        freezerShelfLife: '8-12 months',
        idealStorageLocation: 'Freezer',
        idealStorageTemperature: '-18 C or colder',
      }],
      ['Frozen Berries', [], {
        pantryShelfLife: 'Keep frozen; unsafe after thawing at room temperature',
        refrigeratorShelfLife: '3-5 days after thawing',
        freezerShelfLife: '8-12 months',
        idealStorageLocation: 'Freezer',
        idealStorageTemperature: '-18 C or colder',
      }],
      ['Ice Cream', [], {
        pantryShelfLife: 'Keep frozen',
        refrigeratorShelfLife: 'Not recommended',
        freezerShelfLife: '2-4 months best quality',
        idealStorageLocation: 'Freezer',
        idealStorageTemperature: '-18 C or colder',
        canRefreeze: false,
      }],
      'Frozen Pizza', 'Frozen Paratha', 'Frozen Dumplings', 'Frozen Fries', 'Frozen Fish Fillets',
    ],
  },
];

export const FOOD_KNOWLEDGE_DATABASE = FOOD_GROUPS.flatMap(expandGroup);
