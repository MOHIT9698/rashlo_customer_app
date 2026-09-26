// Unit type drives which quantity picker UI to show (weight chips vs volume chips)
export type UnitType = 'weight' | 'volume';

export interface CategoryItem {
    id: string;
    name: string;                 // English display name
    hindiName?: string;           // local name, useful for search/recognition
    icon: string;                 // emoji used as a lightweight icon (swap for real icons later)

    hasBrandOptions: boolean;     // false = commonly bought loose/unbranded
    commonBrands?: string[];      // only present when hasBrandOptions is true
    // "Local / Loose" is included as a valid choice even for
    // branded items, since many customers don't care

    unitType: UnitType;           // determines whether unitLabel is kg/g or L/ml
    unitLabel: string;            // short label to show next to quantity, e.g. "kg", "L"
    quantityOptions: string[];    // preset chips shown to the customer
    defaultQuantity: string;      // pre-selected chip when the picker opens

    popular?: boolean;            // true = show near top of category item list
    notes?: string;               // dev-facing note, not shown to the customer
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;                // hex, used for category tile background
    image: string;                // hex, used for category tile background
    items: CategoryItem[];
}

export const categories: Category[] = [
    {
        id: 'atta',
        name: 'Atta',
        icon: '🌾',
        color: '#F3E6D0',
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6_3Y9kxlIWCnQuJP1Qp2ctwgj_tHUPNtbXtQgHdwg-w&s",
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
        image:
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500",
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
        image:
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500",
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
    {
        id: "7",
        name: "Salt",
        color: "",
        items: [],
        icon: "",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbPyw-BHtpL66xVry8wNOAdfVkR_9urOk9FqgwzkTsg&s=10",
    },
    {
        id: "8",
        name: "Sugar",
        color: "",
        items: [],
        icon: "",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaq8QI2oNf-20Wk-VWk40QbwVi_7N2WdAHLuCDE3Eqlw&s=10",
    },
    {
        id: "9",
        name: "Tea & Coffee",
        color: "",
        items: [],
        icon: "",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbMTqZnJrzZGWid2bwK8-IH3n7k0ozh8oD_fwgzg7t0A&s=10",
    },
    {
        id: "10",
        name: "Biscuits & Cookies",
        color: "",
        items: [],
        icon: "",
        image:
            "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500",
    },
    {
        id: "11",
        name: "Milk & Dairy",
        color: "",
        items: [],
        icon: "",
        image:
            "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500",
    },
    {
        id: "12",
        name: "Bread",
        color: "",
        items: [],
        icon: "",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjyzBn2cFBy-nghpWzbwbP2MKjtBx1h8SmBLy2VbRzKQ&s=10",
    },
    {
        id: "14",
        name: "Snacks",
        color: "",
        items: [],
        icon: "",
        image:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500",
    },
    {
        id: "15",
        name: "Dry Fruits",
        color: "",
        items: [],
        icon: "",
        image:
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500",
    },
    {
        id: "16",
        name: "Breakfast",
        color: "",
        items: [],
        icon: "",
        image:
            "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=500",
    },
    {
        id: "17",
        name: "Sauces & Spreads",
        color: "",
        items: [],
        icon: "",
        image:
            "https://images.unsplash.com/photo-1472476442910-44a20e9946e8?w=500",
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