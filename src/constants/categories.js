// Product categories for organization
export const CATEGORIES = [
  'Dairy',
  'Vegetables',
  'Fruits',
  'Meat & Poultry',
  'Seafood',
  'Grains & Bread',
  'Condiments',
  'Beverages',
  'Frozen',
  'Canned',
  'Bakery',
  'Snacks',
  'Medications',
  'Supplements',
  'Beauty & Personal Care',
  'Household',
  'Other',
];

export const getCategoryColor = (category) => {
  const colors = {
    'Dairy': '#FFB6C1',
    'Vegetables': '#90EE90',
    'Fruits': '#FFD700',
    'Meat & Poultry': '#CD853F',
    'Seafood': '#87CEEB',
    'Grains & Bread': '#D2691E',
    'Condiments': '#FF8C00',
    'Beverages': '#4169E1',
    'Frozen': '#00BFFF',
    'Canned': '#808080',
    'Bakery': '#F0E68C',
    'Snacks': '#DEB887',
    'Medications': '#FF69B4',
    'Supplements': '#98FB98',
    'Beauty & Personal Care': '#DDA0DD',
    'Household': '#A9A9A9',
    'Other': '#D3D3D3',
  };
  return colors[category] || '#D3D3D3';
};
