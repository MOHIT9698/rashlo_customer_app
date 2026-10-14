import { Order } from '@/constants/ordersData';
import { getShopById } from '@/constants/shops';
import { useCart } from '@/context/CartContext';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
// import { useCart } from '@/contexts/CartContext';
// import { useShop } from '../contexts/ShopContext';
// import { Order } from '../data/orders';
// import { getShopById } from '../data/shops';

export function useReorder() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { trustedShopId } = useShop();

  return function reorder(order: Order) {
    const trustedShop = trustedShopId ? getShopById(trustedShopId) : undefined;
    const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);

    // Real-world case: the old order came from a different shop than the one
    // the customer trusts now. Tell them rather than silently mixing them up.
    const shopNote =
      trustedShop && trustedShop.name !== order.shopName
        ? `\n\nNote: this order was from ${order.shopName}, but your trusted shop is ${trustedShop.name}.`
        : '';

    Alert.alert(
      'Order again?',
      `Add ${itemCount} ${itemCount === 1 ? 'item' : 'items'} from your ${order.date.split(',')[0]} order to your cart? You can edit everything in the cart.${shopNote}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to cart',
          onPress: () => {
            order.items.forEach((item) => {
              for (let i = 0; i < item.qty; i++) {
                addToCart({
                  itemId: `reorder-${item.name}`,
                  itemName: item.name,
                  categoryId: 'custom',
                  quantity: 'Same as before',
                  isCustom: true,
                });
              }
            });
            router.push('/tabs/cart');
          },
        },
      ]
    );
  };
}