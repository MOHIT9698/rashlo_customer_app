import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { HomeIcon, ShopIcon } from '../../src/constants/Icons';
import { Colors } from '../../src/constants/theme';

export default function TabsLayout() {
  const {cart} = useCart();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
        lazy: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#8A8A8A',
        tabBarStyle: {
          height: 80,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          // tabBarBadge: 8,
          tabBarBadge: cart.length > 0 ? cart.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#E03C31',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="shops"
        options={{
          title: 'Shops',
          tabBarIcon: ({ color, size }) => (
            <ShopIcon size={size} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}