// Unit type drives which quantity picker UI to show (weight chips vs volume chips)
export type UnitType = 'weight' | 'volume';

export interface CategoryItem {
  id: string;
  name: string;
  hindiName?: string;
  icon: string;

  hasBrandOptions: boolean;
  commonBrands?: string[];

  unitType: UnitType;
  unitLabel: string;
  quantityOptions: string[];
  defaultQuantity: string;

  popular?: boolean;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;          // emoji fallback, shown if the image fails to load
  color: string;          // backdrop tint behind the fallback icon
  image?: string;          // real photo for the tile — preferred over the icon when it loads
  section: string;         // groups categories under a section header on Home
  items: CategoryItem[];
}

export const categorySections = [
  'Everyday Staples',
  'Breakfast & Dairy',
  'Snacks & More',
] as const;

export const categories: Category[] = [
  {
    id: 'atta',
    name: 'Atta',
    icon: '🌾',
    color: '#F3E6D0',
    image: 'https://images.unsplash.com/photo-1626200926749-93447500d8e1?w=400',
    section: 'Everyday Staples',
    items: [
      {
        id: 'wheat-atta',
        name: 'Wheat Atta',
        hindiName: 'Gehun Atta',
        icon: '🌾',
        hasBrandOptions: true,
        commonBrands: [
          'Aashirvaad',
          'Pillsbury',
          'Fortune Chakki Fresh',
          'Patanjali',
          'Annapurna',
          'Nature Fresh',
          'Local / Loose',
        ],
        unitType: 'weight',
        unitLabel: 'kg',
        quantityOptions: ['1kg', '2kg', '5kg', '10kg'],
        defaultQuantity: '5kg',
        popular: true,
        notes: 'Highest-volume staple item; most families order 5kg or 10kg at once.',
      },
      {
        id: 'multigrain-atta',
        name: 'Multigrain Atta',
        icon: '🌾',
        hasBrandOptions: true,
        commonBrands: [
          'Aashirvaad Multigrain',
          'Pillsbury Multigrain',
          'Fortune Multi Fit',
          'Patanjali Multigrain',
        ],
        unitType: 'weight',
        unitLabel: 'kg',
        quantityOptions: ['1kg', '2kg', '5kg'],
        defaultQuantity: '2kg',
      },
      {
        id: 'besan',
        name: 'Besan (Gram Flour)',
        hindiName: 'Besan',
        icon: '🌾',
        hasBrandOptions: true,
        commonBrands: ['Rajdhani', 'Patanjali', 'Fortune', 'Local / Loose'],
        unitType: 'weight',
        unitLabel: 'kg',
        quantityOptions: ['500g', '1kg', '2kg'],
        defaultQuantity: '1kg',
      },
      {
        id: 'maida',
        name: 'Maida (Refined Flour)',
        hindiName: 'Maida',
        icon: '🌾',
        hasBrandOptions: false,
        unitType: 'weight',
        unitLabel: 'kg',
        quantityOptions: ['500g', '1kg', '2kg'],
        defaultQuantity: '1kg',
        notes: 'Almost always bought loose/unbranded — skip brand picker in UI for this item.',
      },
      {
        id: 'sooji-rava',
        name: 'Sooji / Rava (Semolina)',
        icon: '🌾',
        hasBrandOptions: true,
        commonBrands: ['Aashirvaad', 'Patanjali', 'Local / Loose'],
        unitType: 'weight',
        unitLabel: 'kg',
        quantityOptions: ['500g', '1kg'],
        defaultQuantity: '500g',
      },
      {
        id: 'bajra-atta',
        name: 'Bajra Atta',
        icon: '🌾',
        hasBrandOptions: false,
        unitType: 'weight',
        unitLabel: 'kg',
        quantityOptions: ['500g', '1kg', '2kg'],
        defaultQuantity: '1kg',
        notes: 'Seasonal/regional item, usually loose. Good candidate for "Add custom item" fallback if not stocked.',
      },
    ],
  },

  {
    id: 'oil',
    name: 'Oil & Ghee',
    icon: '🛢️',
    color: '#FCEBD0',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    section: 'Everyday Staples',
    items: [
      {
        id: 'mustard-oil',
        name: 'Mustard Oil',
        hindiName: 'Sarson ka Tel',
        icon: '🛢️',
        hasBrandOptions: true,
        commonBrands: [
          'Fortune',
          'Dhara',
          'Patanjali',
          'Emami Healthy and Tasty',
          'P Mark',
          'Local / Loose',
        ],
        unitType: 'volume',
        unitLabel: 'L',
        quantityOptions: ['500ml', '1L', '2L', '5L'],
        defaultQuantity: '1L',
        popular: true,
      },
      {
        id: 'sunflower-oil',
        name: 'Sunflower Oil',
        icon: '🛢️',
        hasBrandOptions: true,
        commonBrands: ['Fortune', 'Sundrop', 'Saffola', 'Gemini', 'Freedom'],
        unitType: 'volume',
        unitLabel: 'L',
        quantityOptions: ['500ml', '1L', '2L', '5L'],
        defaultQuantity: '1L',
        popular: true,
      },
      {
        id: 'groundnut-oil',
        name: 'Groundnut Oil',
        hindiName: 'Mungfali Tel',
        icon: '🛢️',
        hasBrandOptions: true,
        commonBrands: ['Fortune', 'Dhara', 'Gokul', 'Postman'],
        unitType: 'volume',
        unitLabel: 'L',
        quantityOptions: ['500ml', '1L', '2L', '5L'],
        defaultQuantity: '1L',
      },
      {
        id: 'soybean-oil',
        name: 'Soybean Oil',
        icon: '🛢️',
        hasBrandOptions: true,
        commonBrands: ['Fortune', 'Sundrop', 'Ruchi Gold', 'Nature Fresh'],
        unitType: 'volume',
        unitLabel: 'L',
        quantityOptions: ['500ml', '1L', '2L', '5L'],
        defaultQuantity: '1L',
      },
      {
        id: 'ghee',
        name: 'Ghee',
        hindiName: 'Ghee',
        icon: '🧈',
        hasBrandOptions: true,
        commonBrands: ['Amul', 'Patanjali', 'Mother Dairy', 'Nestle Everyday', 'Local / Homemade'],
        unitType: 'volume',
        unitLabel: 'ml/L',
        quantityOptions: ['200ml', '500ml', '1L'],
        defaultQuantity: '500ml',
        notes: 'Sold in ml/L jars in most brands, though some regional tins are labeled by weight (kg). Consider a unit toggle if you stock both.',
      },
      {
        id: 'coconut-oil',
        name: 'Coconut Oil',
        icon: '🥥',
        hasBrandOptions: true,
        commonBrands: ['Parachute', 'Fortune', 'Patanjali'],
        unitType: 'volume',
        unitLabel: 'ml/L',
        quantityOptions: ['200ml', '500ml', '1L'],
        defaultQuantity: '500ml',
      },
    ],
  },

  {
    id: 'spices',
    name: 'Spices',
    icon: '🌶️',
    color: '#FBE1DE',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    section: 'Everyday Staples',
    items: [
      {
        id: 'turmeric-powder',
        name: 'Turmeric Powder',
        hindiName: 'Haldi',
        icon: '🌶️',
        hasBrandOptions: true,
        commonBrands: ['MDH', 'Everest', 'Catch', 'Badshah', 'Local / Loose'],
        unitType: 'weight',
        unitLabel: 'g',
        quantityOptions: ['50g', '100g', '200g', '500g'],
        defaultQuantity: '100g',
        popular: true,
      },
      {
        id: 'red-chilli-powder',
        name: 'Red Chilli Powder',
        hindiName: 'Lal Mirch',
        icon: '🌶️',
        hasBrandOptions: true,
        commonBrands: ['MDH', 'Everest', 'Catch', 'Badshah', 'Local / Loose'],
        unitType: 'weight',
        unitLabel: 'g',
        quantityOptions: ['50g', '100g', '200g', '500g'],
        defaultQuantity: '100g',
        popular: true,
      },
      {
        id: 'coriander-powder',
        name: 'Coriander Powder',
        hindiName: 'Dhaniya Powder',
        icon: '🌿',
        hasBrandOptions: true,
        commonBrands: ['MDH', 'Everest', 'Catch', 'Local / Loose'],
        unitType: 'weight',
        unitLabel: 'g',
        quantityOptions: ['50g', '100g', '200g', '500g'],
        defaultQuantity: '100g',
      },
      {
        id: 'garam-masala',
        name: 'Garam Masala',
        icon: '🌶️',
        hasBrandOptions: true,
        commonBrands: ['MDH', 'Everest', 'Catch', 'Badshah'],
        unitType: 'weight',
        unitLabel: 'g',
        quantityOptions: ['50g', '100g', '200g'],
        defaultQuantity: '100g',
      },
      {
        id: 'cumin-seeds',
        name: 'Cumin Seeds',
        hindiName: 'Jeera',
        icon: '🌿',
        hasBrandOptions: true,
        commonBrands: ['MDH', 'Everest', 'Catch', 'Local / Loose'],
        unitType: 'weight',
        unitLabel: 'g',
        quantityOptions: ['50g', '100g', '250g'],
        defaultQuantity: '100g',
      },
      {
        id: 'mustard-seeds',
        name: 'Mustard Seeds',
        hindiName: 'Rai',
        icon: '🌿',
        hasBrandOptions: false,
        unitType: 'weight',
        unitLabel: 'g',
        quantityOptions: ['50g', '100g', '250g'],
        defaultQuantity: '100g',
        notes: 'Typically bought loose in small quantities — skip brand picker.',
      },
      {
        id: 'black-pepper',
        name: 'Black Pepper',
        hindiName: 'Kali Mirch',
        icon: '⚫',
        hasBrandOptions: true,
        commonBrands: ['MDH', 'Everest', 'Local / Loose'],
        unitType: 'weight',
        unitLabel: 'g',
        quantityOptions: ['50g', '100g'],
        defaultQuantity: '50g',
      },
    ],
  },

  // The categories below don't have their item catalog filled in yet.
  // That's a real, common state (a shop/catalog team adds categories before
  // item-level data is ready) — the UI needs to handle it gracefully
  // rather than assume every category always has items.
  {
    id: 'salt',
    name: 'Salt',
    icon: '🧂',
    color: '#EFE9DC',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbPyw-BHtpL66xVry8wNOAdfVkR_9urOk9FqgwzkTsg&s=10',
    section: 'Everyday Staples',
    items: [],
  },
  {
    id: 'sugar',
    name: 'Sugar',
    icon: '🍬',
    color: '#F5EFE3',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaq8QI2oNf-20Wk-VWk40QbwVi_7N2WdAHLuCDE3Eqlw&s=10',
    section: 'Everyday Staples',
    items: [],
  },
  {
    id: 'tea-coffee',
    name: 'Tea & Coffee',
    icon: '☕',
    color: '#E6DED3',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbMTqZnJrzZGWid2bwK8-IH3n7k0ozh8oD_fwgzg7t0A&s=10',
    section: 'Breakfast & Dairy',
    items: [],
  },
  {
    id: 'milk-dairy',
    name: 'Milk & Dairy',
    icon: '🥛',
    color: '#EAF2F8',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    section: 'Breakfast & Dairy',
    items: [],
  },
  {
    id: 'bread',
    name: 'Bread',
    icon: '🍞',
    color: '#F6E9D8',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjyzBn2cFBy-nghpWzbwbP2MKjtBx1h8SmBLy2VbRzKQ&s=10',
    section: 'Breakfast & Dairy',
    items: [],
  },
  {
    id: 'breakfast',
    name: 'Breakfast',
    icon: '🥣',
    color: '#FDF1DE',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400',
    section: 'Breakfast & Dairy',
    items: [],
  },
  {
    id: 'biscuits-cookies',
    name: 'Biscuits & Cookies',
    icon: '🍪',
    color: '#F2E2C8',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    section: 'Snacks & More',
    items: [],
  },
  {
    id: 'snacks',
    name: 'Snacks',
    icon: '🍟',
    color: '#FBE6D4',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    section: 'Snacks & More',
    items: [],
  },
  {
    id: 'dry-fruits',
    name: 'Dry Fruits',
    icon: '🥜',
    color: '#F1E4D0',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
    section: 'Snacks & More',
    items: [],
  },
  {
    id: 'sauces-spreads',
    name: 'Sauces & Spreads',
    icon: '🍯',
    color: '#F8E3D8',
    image: 'https://images.unsplash.com/photo-1472476442910-44a20e9946e8?w=400',
    section: 'Snacks & More',
    items: [],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getItemById(itemId: string): CategoryItem | undefined {
  for (const category of categories) {
    const found = category.items.find((i) => i.id === itemId);
    if (found) return found;
  }
  return undefined;
}

export function getCategoriesBySection(section: string): Category[] {
  return categories.filter((c) => c.section === section);
}