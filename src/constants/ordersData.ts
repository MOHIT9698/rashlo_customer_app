export type OrderStatus = 'Delivered' | 'Out for Delivery' | 'Processing' | 'Cancelled';

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  shopName: string;
  date: string;
  status: OrderStatus;
  amount: number;
  itemCount: number;
  items: OrderItem[];
  deliveryFee: number;
  deliveryAddress: string;
  paymentMethod: string;
}

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-10234',
    shopName: 'FreshMart Grocery',
    date: '18 Sep 2026, 6:42 PM',
    status: 'Delivered',
    amount: 842,
    itemCount: 6,
    items: [
      { name: 'Basmati Rice 5kg', qty: 1, price: 420 },
      { name: 'Toor Dal 1kg', qty: 2, price: 110 },
      { name: 'Sunflower Oil 1L', qty: 1, price: 165 },
      { name: 'Wheat Atta 5kg', qty: 1, price: 47 },
    ],
    deliveryFee: 20,
    deliveryAddress: 'House 12, Nissing Road, Karnal, Haryana',
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: '2',
    orderNumber: 'ORD-10256',
    shopName: 'Daily Basket Store',
    date: '19 Sep 2026, 11:15 AM',
    status: 'Out for Delivery',
    amount: 356,
    itemCount: 4,
    items: [
      { name: 'Milk 1L', qty: 2, price: 66 },
      { name: 'Bread', qty: 1, price: 40 },
      { name: 'Eggs (12 pcs)', qty: 1, price: 84 },
      { name: 'Tomatoes 1kg', qty: 1, price: 30 },
    ],
    deliveryFee: 15,
    deliveryAddress: 'House 12, Nissing Road, Karnal, Haryana',
    paymentMethod: 'UPI',
  },
  {
    id: '3',
    orderNumber: 'ORD-10261',
    shopName: 'GreenGrocer Kirana',
    date: '20 Sep 2026, 9:03 AM',
    status: 'Processing',
    amount: 512,
    itemCount: 5,
    items: [
      { name: 'Onion 2kg', qty: 1, price: 60 },
      { name: 'Potato 2kg', qty: 1, price: 50 },
      { name: 'Cooking Oil 1L', qty: 1, price: 165 },
      { name: 'Sugar 1kg', qty: 1, price: 46 },
      { name: 'Tea Powder 250g', qty: 1, price: 90 },
    ],
    deliveryFee: 20,
    deliveryAddress: 'House 12, Nissing Road, Karnal, Haryana',
    paymentMethod: 'Card',
  },
  {
    id: '4',
    orderNumber: 'ORD-10188',
    shopName: 'QuickKirana Express',
    date: '14 Sep 2026, 7:20 PM',
    status: 'Cancelled',
    amount: 210,
    itemCount: 2,
    items: [
      { name: 'Detergent Powder 1kg', qty: 1, price: 140 },
      { name: 'Dish Soap', qty: 1, price: 50 },
    ],
    deliveryFee: 20,
    deliveryAddress: 'House 12, Nissing Road, Karnal, Haryana',
    paymentMethod: 'UPI',
  },
  {
    id: '5',
    orderNumber: 'ORD-10099',
    shopName: 'Sunrise Supermart',
    date: '10 Sep 2026, 5:50 PM',
    status: 'Delivered',
    amount: 1180,
    itemCount: 9,
    items: [
      { name: 'Basmati Rice 5kg', qty: 1, price: 420 },
      { name: 'Ghee 1L', qty: 1, price: 610 },
      { name: 'Salt 1kg', qty: 2, price: 40 },
    ],
    deliveryFee: 20,
    deliveryAddress: 'House 12, Nissing Road, Karnal, Haryana',
    paymentMethod: 'Cash on Delivery',
  },
];

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}