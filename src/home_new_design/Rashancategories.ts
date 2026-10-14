// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Drives which quantity options make sense: kg/g, L/ml, or packs/pieces
export type UnitType = 'weight' | 'volume' | 'count';

export interface CategoryItem {
  id: string;
  name: string;
  hindiName?: string;
  icon: string;               // emoji, used whenever there is no photo (or the photo fails to load)
  image?: string;             // optional product photo URL — fill these in as you source photos

  hasBrandOptions: boolean;   // false = normally bought loose/unbranded, so the brand step is skipped
  commonBrands?: string[];

  unitType: UnitType;
  unitLabel: string;
  quantityOptions: string[];
  defaultQuantity: string;

  popular?: boolean;
  notes?: string;             // developer-facing, never shown to customers
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  image?: string;
  section: string;
  items: CategoryItem[];
}

export const categorySections = [
  'Everyday Staples',
  'Breakfast & Dairy',
  'Snacks & More',
  'Home & Personal',
] as const;

// ---------------------------------------------------------------------------
// Helpers — keep the data below short and consistent
// ---------------------------------------------------------------------------

const LOOSE = 'Local / Loose';

interface Opts {
  hindi?: string;
  popular?: boolean;
  notes?: string;
  image?: string;
}

function build(
  id: string,
  name: string,
  icon: string,
  brands: string[] | null,
  unitType: UnitType,
  unitLabel: string,
  qty: string[],
  def: string,
  o: Opts
): CategoryItem {
  const hasBrands = !!brands && brands.length > 0;
  return {
    id,
    name,
    hindiName: o.hindi,
    icon,
    image: o.image,
    hasBrandOptions: hasBrands,
    commonBrands: hasBrands ? brands! : undefined,
    unitType,
    unitLabel,
    quantityOptions: qty,
    defaultQuantity: def,
    popular: o.popular,
    notes: o.notes,
  };
}

// brands = null means "usually loose / unbranded, skip the brand step"
const weight = (id: string, name: string, icon: string, brands: string[] | null, qty: string[], def: string, o: Opts = {}) =>
  build(id, name, icon, brands, 'weight', qty.some((q) => q.endsWith('kg')) ? 'kg' : 'g', qty, def, o);

const volume = (id: string, name: string, icon: string, brands: string[] | null, qty: string[], def: string, o: Opts = {}) =>
  build(id, name, icon, brands, 'volume', qty.some((q) => q.endsWith('L')) ? 'L' : 'ml', qty, def, o);

const count = (id: string, name: string, icon: string, brands: string[] | null, qty: string[], def: string, o: Opts = {}) =>
  build(id, name, icon, brands, 'count', 'pcs', qty, def, o);

// Shared quantity sets
const KG_BIG = ['1kg', '2kg', '5kg', '10kg'];
const KG_STD = ['500g', '1kg', '2kg', '5kg'];
const KG_SMALL = ['500g', '1kg', '2kg'];
const G_SPICE = ['50g', '100g', '200g', '500g'];
const G_RARE = ['10g', '25g', '50g', '100g'];
const G_NUTS = ['100g', '250g', '500g', '1kg'];
const L_OIL = ['500ml', '1L', '2L', '5L'];
const PACKS = ['1 pack', '2 packs', '4 packs', '6 packs'];

// Shared brand sets
const SPICE_BRANDS = ['MDH', 'Everest', 'Catch', 'Badshah', LOOSE];
const DAL_BRANDS = ['Tata Sampann', 'Fortune', 'Patanjali', LOOSE];
const ATTA_BRANDS = ['Aashirvaad', 'Pillsbury', 'Fortune Chakki Fresh', 'Patanjali', 'Annapurna', 'Nature Fresh', LOOSE];
const RICE_BRANDS = ['India Gate', 'Daawat', 'Kohinoor', 'Fortune', LOOSE];
const DAIRY_BRANDS = ['Amul', 'Mother Dairy', 'Verka', 'Vita', LOOSE];
const NUT_BRANDS = [LOOSE, 'Happilo', 'Nutraj'];

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  // ======================= EVERYDAY STAPLES =======================
  {
    id: 'atta',
    name: 'Atta',
    icon: '🌾',
    color: '#F3E6D0',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6_3Y9kxlIWCnQuJP1Qp2ctwgj_tHUPNtbXtQgHdwg-w&s',
    section: 'Everyday Staples',
    items: [
      weight('wheat-atta', 'Wheat Atta', '🌾', ATTA_BRANDS, KG_BIG, '5kg', {
        hindi: 'Gehun Atta',
        popular: true,
        notes: 'Highest-volume staple; most families order 5kg or 10kg at once.',
      }),
      weight('multigrain-atta', 'Multigrain Atta', '🌾', ['Aashirvaad Multigrain', 'Pillsbury Multigrain', 'Fortune Multi Fit', 'Patanjali Multigrain'], ['1kg', '2kg', '5kg'], '2kg'),
      weight('besan', 'Besan (Gram Flour)', '🌾', ['Rajdhani', 'Patanjali', 'Fortune', LOOSE], KG_SMALL, '1kg', { hindi: 'Besan' }),
      weight('maida', 'Maida (Refined Flour)', '🌾', null, KG_SMALL, '1kg', { hindi: 'Maida', notes: 'Almost always loose — brand step skipped.' }),
      weight('sooji-rava', 'Sooji / Rava (Semolina)', '🌾', ['Aashirvaad', 'Patanjali', LOOSE], ['500g', '1kg'], '500g', { hindi: 'Sooji' }),
      weight('bajra-atta', 'Bajra Atta', '🌾', null, KG_SMALL, '1kg', { hindi: 'Bajra Atta', notes: 'Seasonal and regional, usually loose.' }),
      weight('jowar-atta', 'Jowar Atta', '🌾', null, KG_SMALL, '1kg', { hindi: 'Jowar Atta' }),
      weight('ragi-atta', 'Ragi Atta', '🌾', null, KG_SMALL, '1kg', { hindi: 'Ragi Atta' }),
      weight('makki-atta', 'Makki Atta (Corn Flour)', '🌽', null, KG_SMALL, '1kg', { hindi: 'Makke ka Atta', notes: 'Winter favourite in Haryana and Punjab.' }),
      weight('rice-flour', 'Rice Flour', '🌾', null, ['500g', '1kg'], '500g', { hindi: 'Chawal ka Atta' }),
    ],
  },

  {
    id: 'rice',
    name: 'Rice & Grains',
    icon: '🍚',
    color: '#F7F1E1',
    section: 'Everyday Staples',
    items: [
      weight('basmati-rice', 'Basmati Rice', '🍚', RICE_BRANDS, KG_BIG, '5kg', { hindi: 'Basmati Chawal', popular: true }),
      weight('sella-basmati', 'Sella (Parboiled) Basmati', '🍚', ['India Gate', 'Daawat', 'Kohinoor', LOOSE], KG_BIG, '5kg'),
      weight('regular-rice', 'Regular Rice', '🍚', ['Fortune', 'Kohinoor', LOOSE], KG_BIG, '5kg', { hindi: 'Chawal' }),
      weight('brown-rice', 'Brown Rice', '🍚', ['Daawat', 'Fortune', LOOSE], ['500g', '1kg', '2kg'], '1kg'),
      weight('poha', 'Poha (Flattened Rice)', '🍚', null, ['500g', '1kg', '2kg'], '500g', { hindi: 'Poha' }),
      weight('daliya', 'Daliya (Broken Wheat)', '🌾', null, KG_SMALL, '500g', { hindi: 'Daliya' }),
      weight('sabudana', 'Sabudana (Sago)', '⚪', null, ['250g', '500g', '1kg'], '500g', { hindi: 'Sabudana' }),
    ],
  },

  {
    id: 'dal',
    name: 'Dal & Pulses',
    icon: '🫘',
    color: '#F5E8CF',
    section: 'Everyday Staples',
    items: [
      weight('toor-dal', 'Toor / Arhar Dal', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Arhar Dal', popular: true }),
      weight('moong-dal', 'Moong Dal (Yellow)', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Moong Dal', popular: true }),
      weight('moong-chilka', 'Moong Dal (Green, with skin)', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Moong Chilka' }),
      weight('masoor-dal', 'Masoor Dal', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Masoor Dal' }),
      weight('chana-dal', 'Chana Dal', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Chana Dal' }),
      weight('urad-dal', 'Urad Dal (Split)', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Urad Dal' }),
      weight('urad-whole', 'Urad Dal (Whole, Black)', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Kali Urad' }),
      weight('kabuli-chana', 'Kabuli Chana (Chickpeas)', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Chole' }),
      weight('kala-chana', 'Kala Chana', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Kala Chana' }),
      weight('rajma', 'Rajma (Kidney Beans)', '🫘', DAL_BRANDS, KG_STD, '1kg', { hindi: 'Rajma' }),
      weight('lobia', 'Lobia (Black-eyed Peas)', '🫘', null, KG_SMALL, '500g', { hindi: 'Lobia' }),
      weight('dry-peas', 'Dried Green Peas', '🟢', null, KG_SMALL, '500g', { hindi: 'Sukhi Matar' }),
      weight('soya-chunks', 'Soya Chunks', '🫘', ['Nutrela', 'Patanjali', LOOSE], ['200g', '500g', '1kg'], '200g', { hindi: 'Soya Badi' }),
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
      volume('mustard-oil', 'Mustard Oil', '🛢️', ['Fortune', 'Dhara', 'Patanjali', 'Emami Healthy and Tasty', 'P Mark', LOOSE], L_OIL, '1L', { hindi: 'Sarson ka Tel', popular: true }),
      volume('sunflower-oil', 'Sunflower Oil', '🛢️', ['Fortune', 'Sundrop', 'Saffola', 'Gemini', 'Freedom'], L_OIL, '1L', { popular: true }),
      volume('groundnut-oil', 'Groundnut Oil', '🛢️', ['Fortune', 'Dhara', 'Gokul', 'Postman'], L_OIL, '1L', { hindi: 'Mungfali Tel' }),
      volume('soybean-oil', 'Soybean Oil', '🛢️', ['Fortune', 'Sundrop', 'Ruchi Gold', 'Nature Fresh'], L_OIL, '1L'),
      volume('rice-bran-oil', 'Rice Bran Oil', '🛢️', ['Fortune', 'Patanjali', 'Dhara'], ['500ml', '1L', '5L'], '1L'),
      volume('olive-oil', 'Olive Oil', '🫒', ['Figaro', 'Del Monte', 'Saffola'], ['250ml', '500ml', '1L'], '500ml'),
      volume('coconut-oil', 'Coconut Oil', '🥥', ['Parachute', 'Fortune', 'Patanjali'], ['200ml', '500ml', '1L'], '500ml'),
      volume('ghee', 'Ghee', '🧈', ['Amul', 'Patanjali', 'Mother Dairy', 'Nestle Everyday', 'Local / Homemade'], ['200ml', '500ml', '1L'], '500ml', {
        hindi: 'Ghee',
        notes: 'Some regional tins are labelled in kg. Consider a unit toggle later.',
      }),
      volume('vanaspati', 'Vanaspati (Dalda)', '🧈', ['Dalda', 'Gagan', LOOSE], ['500ml', '1L', '2L'], '1L'),
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
      weight('turmeric-powder', 'Turmeric Powder', '🌶️', SPICE_BRANDS, G_SPICE, '100g', { hindi: 'Haldi', popular: true }),
      weight('red-chilli-powder', 'Red Chilli Powder', '🌶️', SPICE_BRANDS, G_SPICE, '100g', { hindi: 'Lal Mirch', popular: true }),
      weight('coriander-powder', 'Coriander Powder', '🌿', SPICE_BRANDS, G_SPICE, '100g', { hindi: 'Dhaniya Powder' }),
      weight('garam-masala', 'Garam Masala', '🌶️', SPICE_BRANDS, ['50g', '100g', '200g'], '100g'),
      weight('cumin-seeds', 'Cumin Seeds', '🌿', SPICE_BRANDS, ['50g', '100g', '250g'], '100g', { hindi: 'Jeera' }),
      weight('mustard-seeds', 'Mustard Seeds', '🌿', null, ['50g', '100g', '250g'], '100g', { hindi: 'Rai' }),
      weight('black-pepper', 'Black Pepper', '⚫', ['MDH', 'Everest', LOOSE], ['50g', '100g'], '50g', { hindi: 'Kali Mirch' }),
      weight('kashmiri-chilli', 'Kashmiri Chilli Powder', '🌶️', SPICE_BRANDS, G_SPICE, '100g', { hindi: 'Kashmiri Mirch' }),
      weight('amchur', 'Dry Mango Powder', '🥭', SPICE_BRANDS, ['50g', '100g', '200g'], '100g', { hindi: 'Amchur' }),
      weight('hing', 'Asafoetida', '🌿', ['LG', 'Vandevi', 'Patanjali'], G_RARE, '25g', { hindi: 'Hing' }),
      weight('ajwain', 'Carom Seeds', '🌿', SPICE_BRANDS, ['50g', '100g', '200g'], '50g', { hindi: 'Ajwain' }),
      weight('fennel-seeds', 'Fennel Seeds', '🌿', SPICE_BRANDS, ['50g', '100g', '250g'], '100g', { hindi: 'Saunf' }),
      weight('green-cardamom', 'Green Cardamom', '🌿', SPICE_BRANDS, G_RARE, '25g', { hindi: 'Elaichi' }),
      weight('cloves', 'Cloves', '🌿', SPICE_BRANDS, G_RARE, '25g', { hindi: 'Laung' }),
      weight('cinnamon', 'Cinnamon', '🌿', SPICE_BRANDS, ['25g', '50g', '100g'], '50g', { hindi: 'Dalchini' }),
      weight('bay-leaf', 'Bay Leaf', '🍃', SPICE_BRANDS, ['25g', '50g', '100g'], '25g', { hindi: 'Tej Patta' }),
      weight('kasuri-methi', 'Kasuri Methi', '🍃', SPICE_BRANDS, ['25g', '50g', '100g'], '50g'),
      weight('chaat-masala', 'Chaat Masala', '🌶️', SPICE_BRANDS, ['50g', '100g', '200g'], '100g'),
      weight('sabzi-masala', 'Sabzi Masala', '🌶️', SPICE_BRANDS, ['50g', '100g', '200g'], '100g'),
      weight('chole-masala', 'Chole Masala', '🌶️', SPICE_BRANDS, ['50g', '100g', '200g'], '100g'),
      weight('kitchen-king', 'Kitchen King Masala', '🌶️', ['MDH', 'Everest', 'Catch'], ['50g', '100g', '200g'], '100g'),
    ],
  },

  {
    id: 'salt',
    name: 'Salt',
    icon: '🧂',
    color: '#EFE9DC',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbPyw-BHtpL66xVry8wNOAdfVkR_9urOk9FqgwzkTsg&s=10',
    section: 'Everyday Staples',
    items: [
      weight('iodised-salt', 'Iodised Salt', '🧂', ['Tata', 'Annapurna', 'Aashirvaad', 'Catch', 'Patanjali'], ['500g', '1kg', '2kg'], '1kg', { hindi: 'Namak', popular: true }),
      weight('rock-salt', 'Rock Salt', '🧂', ['Catch', 'Patanjali', LOOSE], ['500g', '1kg'], '500g', { hindi: 'Sendha Namak', notes: 'Used for fasting days.' }),
      weight('black-salt', 'Black Salt', '🧂', ['Catch', 'Patanjali', LOOSE], ['100g', '200g', '500g'], '200g', { hindi: 'Kala Namak' }),
    ],
  },

  {
    id: 'sugar',
    name: 'Sugar & Jaggery',
    icon: '🍬',
    color: '#F5EFE3',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaq8QI2oNf-20Wk-VWk40QbwVi_7N2WdAHLuCDE3Eqlw&s=10',
    section: 'Everyday Staples',
    items: [
      weight('white-sugar', 'Sugar', '🍬', ['Madhur', 'Dhampur', LOOSE], ['1kg', '2kg', '5kg', '10kg'], '5kg', { hindi: 'Chini', popular: true }),
      weight('brown-sugar', 'Brown Sugar', '🍬', ['Madhur', 'Dhampur', LOOSE], ['500g', '1kg'], '500g'),
      weight('jaggery', 'Jaggery', '🟤', [LOOSE, 'Patanjali'], KG_STD, '1kg', { hindi: 'Gud' }),
      weight('mishri', 'Mishri (Rock Sugar)', '🍬', null, ['250g', '500g', '1kg'], '500g', { hindi: 'Mishri' }),
      weight('bura-sugar', 'Powdered Sugar', '🍬', null, ['500g', '1kg'], '500g', { hindi: 'Bura' }),
    ],
  },

  // ======================= BREAKFAST & DAIRY =======================
  {
    id: 'tea-coffee',
    name: 'Tea & Coffee',
    icon: '☕',
    color: '#E6DED3',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbMTqZnJrzZGWid2bwK8-IH3n7k0ozh8oD_fwgzg7t0A&s=10',
    section: 'Breakfast & Dairy',
    items: [
      weight('tea-leaf', 'Tea Powder', '🍵', ['Tata Tea', 'Red Label', 'Taj Mahal', 'Wagh Bakri', 'Society', LOOSE], ['100g', '250g', '500g', '1kg'], '250g', { hindi: 'Chai Patti', popular: true }),
      count('green-tea', 'Green Tea (Bags)', '🍵', ['Lipton', 'Tetley', 'Organic India', 'Twinings'], ['25 bags', '50 bags', '100 bags'], '25 bags'),
      weight('instant-coffee', 'Instant Coffee', '☕', ['Nescafe', 'Bru', 'Continental', 'Sunrise'], ['50g', '100g', '200g'], '100g'),
      weight('filter-coffee', 'Filter Coffee Powder', '☕', ['Bru', 'Continental', LOOSE], ['100g', '250g', '500g'], '250g'),
      weight('chai-masala', 'Chai Masala', '🌿', ['Everest', 'MDH', 'Catch'], ['25g', '50g', '100g'], '50g'),
    ],
  },

  {
    id: 'milk-dairy',
    name: 'Milk & Dairy',
    icon: '🥛',
    color: '#EAF2F8',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    section: 'Breakfast & Dairy',
    items: [
      volume('milk', 'Milk', '🥛', DAIRY_BRANDS, ['500ml', '1L', '2L'], '1L', { hindi: 'Doodh', popular: true }),
      weight('paneer', 'Paneer', '🧀', DAIRY_BRANDS, ['200g', '500g', '1kg'], '200g'),
      weight('curd', 'Curd', '🥣', DAIRY_BRANDS, ['200g', '400g', '1kg'], '400g', { hindi: 'Dahi' }),
      volume('buttermilk', 'Buttermilk', '🥛', ['Amul', 'Mother Dairy', 'Verka'], ['200ml', '500ml', '1L'], '500ml', { hindi: 'Chaas' }),
      weight('butter', 'Butter', '🧈', ['Amul', 'Mother Dairy', 'Britannia'], ['100g', '200g', '500g'], '100g', { hindi: 'Makhan' }),
      weight('cheese', 'Cheese', '🧀', ['Amul', 'Britannia', 'Mother Dairy'], ['100g', '200g', '400g'], '200g'),
      count('eggs', 'Eggs', '🥚', null, ['6 pcs', '12 pcs', '30 pcs'], '12 pcs', { hindi: 'Anda', popular: true }),
      weight('milk-powder', 'Milk Powder', '🥛', ['Amul', 'Nestle Everyday'], ['200g', '500g', '1kg'], '500g'),
    ],
  },

  {
    id: 'bread',
    name: 'Bread & Bakery',
    icon: '🍞',
    color: '#F6E9D8',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjyzBn2cFBy-nghpWzbwbP2MKjtBx1h8SmBLy2VbRzKQ&s=10',
    section: 'Breakfast & Dairy',
    items: [
      count('white-bread', 'White Bread', '🍞', ['Britannia', 'Modern', 'Harvest Gold', 'English Oven', 'Local Bakery'], ['1 pack', '2 packs', '3 packs'], '1 pack', { popular: true }),
      count('brown-bread', 'Brown Bread', '🍞', ['Britannia', 'Modern', 'Harvest Gold', 'English Oven'], ['1 pack', '2 packs'], '1 pack'),
      count('pav', 'Pav', '🥖', ['Britannia', 'Modern', 'Local Bakery'], ['6 pcs', '12 pcs'], '6 pcs'),
      count('burger-buns', 'Burger Buns', '🍔', ['Britannia', 'Modern', 'Local Bakery'], ['4 pcs', '6 pcs'], '6 pcs'),
      count('rusk', 'Rusk (Toast)', '🍞', ['Britannia', 'Parle', 'Local Bakery'], ['1 pack', '2 packs', '4 packs'], '1 pack'),
      count('cake-rusk', 'Cake Rusk', '🍞', ['Britannia', 'Local Bakery'], ['1 pack', '2 packs'], '1 pack'),
    ],
  },

  {
    id: 'breakfast',
    name: 'Breakfast',
    icon: '🥣',
    color: '#FDF1DE',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400',
    section: 'Breakfast & Dairy',
    items: [
      weight('cornflakes', 'Cornflakes', '🥣', ["Kellogg's", "Bagrry's", 'Saffola'], ['250g', '500g', '875g'], '500g'),
      weight('oats', 'Oats', '🥣', ['Quaker', 'Saffola', "Kellogg's", "Bagrry's"], ['400g', '1kg'], '400g'),
      weight('muesli', 'Muesli', '🥣', ["Kellogg's", 'Saffola', "Bagrry's"], ['250g', '500g'], '500g'),
      weight('vermicelli', 'Vermicelli', '🍜', ['Bambino', 'Anil', LOOSE], ['200g', '500g'], '200g', { hindi: 'Seviyan' }),
      weight('custard-powder', 'Custard Powder', '🍮', ['Weikfield', 'Brown & Polson'], ['100g', '200g', '500g'], '200g'),
    ],
  },

  // ======================= SNACKS & MORE =======================
  {
    id: 'biscuits-cookies',
    name: 'Biscuits & Cookies',
    icon: '🍪',
    color: '#F2E2C8',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    section: 'Snacks & More',
    items: [
      count('glucose-biscuits', 'Glucose Biscuits', '🍪', ['Parle-G', 'Britannia Tiger', 'Priyagold', 'Sunfeast'], PACKS, '2 packs', { popular: true }),
      count('marie-biscuits', 'Marie Biscuits', '🍪', ['Britannia Marie Gold', 'Parle Marie', 'Sunfeast Marie Light'], PACKS, '1 pack'),
      count('cream-biscuits', 'Cream Biscuits', '🍪', ['Oreo', 'Britannia Bourbon', 'Parle Hide & Seek', 'Sunfeast Dark Fantasy'], PACKS, '1 pack'),
      count('cookies', 'Cookies', '🍪', ['Britannia Good Day', 'Unibic', "Sunfeast Mom's Magic"], PACKS, '1 pack'),
      count('digestive-biscuits', 'Digestive Biscuits', '🍪', ['Britannia NutriChoice', 'Sunfeast Farmlite', "McVitie's"], ['1 pack', '2 packs'], '1 pack'),
      count('salted-crackers', 'Salted Crackers', '🍘', ['Parle Monaco', 'Britannia 50-50', 'Parle Krackjack'], PACKS, '1 pack'),
    ],
  },

  {
    id: 'snacks',
    name: 'Snacks',
    icon: '🍟',
    color: '#FBE6D4',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    section: 'Snacks & More',
    items: [
      count('instant-noodles', 'Instant Noodles', '🍜', ['Maggi', 'Yippee', 'Top Ramen', 'Knorr'], ['1 pack', '2 packs', '6 packs', '12 packs'], '2 packs', { popular: true }),
      count('potato-chips', 'Potato Chips', '🍟', ["Lay's", 'Uncle Chipps', 'Bingo', 'Balaji'], ['1 pack', '2 packs', '5 packs'], '2 packs'),
      count('corn-puffs', 'Corn Puffs', '🍿', ['Kurkure', 'Cheetos', 'Bingo Mad Angles'], ['1 pack', '2 packs', '5 packs'], '2 packs'),
      weight('bhujia-namkeen', 'Bhujia & Namkeen', '🥨', ["Haldiram's", 'Bikaji', 'Bikano', LOOSE], ['200g', '400g', '1kg'], '400g'),
      weight('roasted-chana', 'Roasted Chana', '🥜', null, ['200g', '500g'], '200g', { hindi: 'Bhuna Chana' }),
      count('popcorn', 'Popcorn', '🍿', ['ACT II', LOOSE], ['1 pack', '3 packs'], '1 pack'),
      weight('pasta', 'Pasta / Macaroni', '🍝', ['Maggi', 'Del Monte', LOOSE], ['200g', '500g', '1kg'], '500g'),
    ],
  },

  {
    id: 'dry-fruits',
    name: 'Dry Fruits',
    icon: '🥜',
    color: '#F1E4D0',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
    section: 'Snacks & More',
    items: [
      weight('almonds', 'Almonds', '🥜', NUT_BRANDS, G_NUTS, '250g', { hindi: 'Badam', popular: true }),
      weight('cashews', 'Cashews', '🥜', NUT_BRANDS, G_NUTS, '250g', { hindi: 'Kaju' }),
      weight('raisins', 'Raisins', '🍇', NUT_BRANDS, G_NUTS, '250g', { hindi: 'Kishmish' }),
      weight('walnuts', 'Walnut Kernels', '🥜', NUT_BRANDS, G_NUTS, '250g', { hindi: 'Akhrot' }),
      weight('pistachios', 'Pistachios', '🥜', NUT_BRANDS, G_NUTS, '250g', { hindi: 'Pista' }),
      weight('dates', 'Dates', '🌴', NUT_BRANDS, G_NUTS, '500g', { hindi: 'Khajoor' }),
      weight('figs', 'Dried Figs', '🥜', NUT_BRANDS, G_NUTS, '250g', { hindi: 'Anjeer' }),
      weight('makhana', 'Makhana (Fox Nuts)', '⚪', NUT_BRANDS, ['100g', '250g', '500g'], '250g'),
      weight('peanuts', 'Peanuts', '🥜', null, ['250g', '500g', '1kg'], '500g', { hindi: 'Moongfali' }),
      weight('mixed-dry-fruits', 'Mixed Dry Fruits', '🥜', NUT_BRANDS, G_NUTS, '250g'),
    ],
  },

  {
    id: 'sauces-spreads',
    name: 'Sauces & Spreads',
    icon: '🍯',
    color: '#F8E3D8',
    image: 'https://images.unsplash.com/photo-1472476442910-44a20e9946e8?w=400',
    section: 'Snacks & More',
    items: [
      weight('tomato-ketchup', 'Tomato Ketchup', '🍅', ['Kissan', 'Maggi', 'Del Monte', 'Veeba'], ['200g', '500g', '1kg'], '500g', { popular: true }),
      volume('soya-sauce', 'Soya Sauce', '🍶', ["Ching's", 'Veeba', LOOSE], ['100ml', '200ml', '500ml'], '200ml'),
      weight('chilli-sauce', 'Chilli Sauce', '🌶️', ["Ching's Secret", 'Maggi', 'Veeba'], ['100g', '200g', '500g'], '200g'),
      weight('mayonnaise', 'Mayonnaise', '🥫', ['Veeba', 'Funfoods', 'Dr. Oetker'], ['250g', '500g'], '250g'),
      weight('jam', 'Fruit Jam', '🍓', ['Kissan', "Mala's", 'Tops'], ['200g', '500g'], '500g'),
      weight('peanut-butter', 'Peanut Butter', '🥜', ['Sundrop', 'Pintola', 'MyFitness'], ['200g', '400g', '1kg'], '400g'),
      weight('honey', 'Honey', '🍯', ['Dabur', 'Patanjali', 'Saffola'], ['100g', '250g', '500g'], '250g', { hindi: 'Shahad' }),
      volume('vinegar', 'Vinegar', '🍶', ['Tops', LOOSE], ['200ml', '500ml'], '500ml', { hindi: 'Sirka' }),
    ],
  },

  {
    id: 'pickles-papad',
    name: 'Pickles & Papad',
    icon: '🥒',
    color: '#E9F0DC',
    section: 'Snacks & More',
    items: [
      weight('mango-pickle', 'Mango Pickle', '🥭', ["Mother's Recipe", 'Priya', 'Patanjali', 'Local / Homemade'], ['200g', '500g', '1kg'], '500g', { hindi: 'Aam ka Achar' }),
      weight('mixed-pickle', 'Mixed Pickle', '🥒', ["Mother's Recipe", 'Priya', 'Patanjali', 'Local / Homemade'], ['200g', '500g', '1kg'], '500g', { hindi: 'Mixed Achar' }),
      weight('lime-pickle', 'Lime Pickle', '🍋', ["Mother's Recipe", 'Priya', 'Patanjali', 'Local / Homemade'], ['200g', '500g', '1kg'], '500g', { hindi: 'Nimbu ka Achar' }),
      weight('papad', 'Papad', '🫓', ['Lijjat', "Haldiram's", LOOSE], ['200g', '500g'], '200g'),
    ],
  },

  // ======================= HOME & PERSONAL =======================
  {
    id: 'household',
    name: 'Cleaning & Household',
    icon: '🧼',
    color: '#E4F1F2',
    section: 'Home & Personal',
    items: [
      weight('detergent-powder', 'Detergent Powder', '🧺', ['Surf Excel', 'Ariel', 'Tide', 'Wheel', 'Rin', 'Ghadi'], ['500g', '1kg', '2kg', '4kg'], '1kg', { popular: true }),
      volume('detergent-liquid', 'Liquid Detergent', '🧴', ['Surf Excel', 'Ariel', 'Tide'], ['500ml', '1L', '2L'], '1L'),
      count('dishwash-bar', 'Dishwash Bar', '🧼', ['Vim', 'Exo', 'Pril'], ['1 pc', '3 pcs', '6 pcs'], '3 pcs'),
      volume('dishwash-liquid', 'Dishwash Liquid', '🧴', ['Vim', 'Pril', 'Exo'], ['250ml', '500ml', '1L'], '500ml'),
      volume('floor-cleaner', 'Floor Cleaner', '🧹', ['Lizol', 'Domex', 'Mr Muscle'], ['500ml', '1L', '2L'], '1L'),
      volume('toilet-cleaner', 'Toilet Cleaner', '🚽', ['Harpic', 'Domex'], ['500ml', '1L'], '500ml'),
      volume('phenyl', 'Phenyl', '🧴', null, ['500ml', '1L', '5L'], '1L'),
      volume('handwash', 'Handwash', '🧼', ['Dettol', 'Lifebuoy', 'Savlon'], ['200ml', '500ml', '1L'], '200ml'),
      count('garbage-bags', 'Garbage Bags', '🛍️', null, ['1 pack', '3 packs'], '1 pack'),
      count('agarbatti', 'Agarbatti (Incense)', '🪔', ['Cycle', 'Mangaldeep', 'Zed Black', 'Patanjali'], ['1 pack', '3 packs', '6 packs'], '1 pack'),
      count('matchbox', 'Matchbox', '🔥', ['Ship', 'Homelite'], ['1 pack', '5 packs'], '1 pack'),
    ],
  },

  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '🧴',
    color: '#F3E4EE',
    section: 'Home & Personal',
    items: [
      count('bathing-soap', 'Bathing Soap', '🧼', ['Lux', 'Lifebuoy', 'Dettol', 'Dove', 'Santoor', 'Cinthol', 'Pears'], ['1 pc', '3 pcs', '6 pcs'], '3 pcs', { popular: true }),
      volume('shampoo', 'Shampoo', '🧴', ['Clinic Plus', 'Head & Shoulders', 'Pantene', 'Dove', 'Sunsilk'], ['80ml', '180ml', '340ml', '650ml'], '180ml'),
      weight('toothpaste', 'Toothpaste', '🪥', ['Colgate', 'Pepsodent', 'Dabur Red', 'Closeup', 'Patanjali Dant Kanti', 'Sensodyne'], ['100g', '200g', '300g'], '200g', { popular: true }),
      count('toothbrush', 'Toothbrush', '🪥', ['Colgate', 'Oral-B', LOOSE], ['1 pc', '2 pcs', '4 pcs'], '1 pc'),
      volume('hair-oil', 'Hair Oil', '🧴', ['Parachute', 'Dabur Amla', 'Bajaj Almond Drops', 'Navratna'], ['100ml', '200ml', '500ml'], '200ml'),
      weight('talcum-powder', 'Talcum Powder', '🧴', ['Ponds', 'Nycil', LOOSE], ['100g', '200g'], '100g'),
      count('sanitary-pads', 'Sanitary Pads', '🩷', ['Whisper', 'Stayfree', 'Sofy'], ['1 pack', '2 packs', '3 packs'], '1 pack'),
      weight('face-wash', 'Face Wash', '🧴', ['Himalaya', 'Garnier', 'Nivea'], ['50g', '100g'], '100g'),
    ],
  },
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

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

export function getCategoryOfItem(itemId: string): Category | undefined {
  return categories.find((c) => c.items.some((i) => i.id === itemId));
}

export function getCategoriesBySection(section: string): Category[] {
  return categories.filter((c) => c.section === section);
}

export function getTotalItemCount(): number {
  return categories.reduce((sum, c) => sum + c.items.length, 0);
}