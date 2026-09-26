export interface Shop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  verified: boolean;         // manually verified by the platform — this is what backs "trusted"
  deliveryRadiusKm: number;  // shop won't reliably deliver beyond this
  openNow: boolean;
  phone?: string;
  categoriesServed: string[]; // category ids this shop stocks, e.g. 'atta', 'oil'
}

// Mock user location for distance calculations (would come from the
// device's GPS or the user's saved profile address in a real build)
export const MOCK_USER_LOCATION = {
  latitude: 29.6857,
  longitude: 76.9905,
};

export const shops: Shop[] = [
  {
    id: 'shop-1',
    name: 'FreshMart Grocery',
    address: 'Main Road, Nissing, Karnal',
    latitude: 29.6875,
    longitude: 76.9932,
    verified: true,
    deliveryRadiusKm: 5,
    openNow: true,
    phone: '+91 98765 43210',
    categoriesServed: ['atta', 'oil', 'spices'],
  },
  {
    id: 'shop-2',
    name: 'Daily Basket Store',
    address: 'Kaithal Road, Karnal',
    latitude: 29.6790,
    longitude: 76.9850,
    verified: true,
    deliveryRadiusKm: 4,
    openNow: true,
    phone: '+91 98123 45678',
    categoriesServed: ['atta', 'spices'],
  },
  {
    id: 'shop-3',
    name: 'GreenGrocer Kirana',
    address: 'Sector 12, Karnal',
    latitude: 29.6920,
    longitude: 76.9800,
    verified: false,
    deliveryRadiusKm: 3,
    openNow: false,
    categoriesServed: ['oil', 'spices'],
  },
  {
    id: 'shop-4',
    name: 'QuickKirana Express',
    address: 'Nissing Bypass, Karnal',
    latitude: 29.6810,
    longitude: 76.9980,
    verified: true,
    deliveryRadiusKm: 6,
    openNow: true,
    phone: '+91 99887 66554',
    categoriesServed: ['atta', 'oil', 'spices'],
  },
  {
    id: 'shop-5',
    name: 'Sunrise Supermart',
    address: 'GT Road, Karnal',
    latitude: 29.7050,
    longitude: 76.9700,
    verified: true,
    deliveryRadiusKm: 5,
    openNow: true,
    categoriesServed: ['atta', 'oil'],
  },
  {
    id: 'shop-6',
    name: 'Village Ration Depot',
    address: 'Nissing Village, Karnal',
    latitude: 29.6650,
    longitude: 76.9600,
    verified: false,
    deliveryRadiusKm: 2,
    openNow: true,
    categoriesServed: ['atta'],
  },
];