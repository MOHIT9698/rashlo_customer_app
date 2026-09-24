import AnimatedScreen from '@/components/animated_screen/AnimatedScreen';
import { Order, orders, OrderStatus } from '@/constants/ordersData';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string }> = {
  Delivered: { bg: '#E4F6E9', text: '#1E9E4C' },
  'Out for Delivery': { bg: '#E8F1FC', text: '#3B7FB0' },
  Processing: { bg: '#FFF3E0', text: '#E8A33D' },
  Cancelled: { bg: '#FDEAEA', text: '#E03C31' },
};

export default function OrdersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </SafeAreaView>
  );
}

function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const statusStyle = STATUS_STYLES[order.status];

  return (
    <AnimatedScreen>
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/order/${order.id}`)}
    >
      <View style={styles.cardTop}>
        <View style={styles.shopIconWrap}>
          <Ionicons name="storefront-outline" size={20} color="#3B7FB0" />
        </View>

        <View style={styles.cardTopText}>
          <Text style={styles.shopName} numberOfLines={1}>
            {order.shopName}
          </Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={13} color="#8A8A8A" />
            <Text style={styles.dateText}>{order.date}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottom}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {order.status}
          </Text>
        </View>

        <Text style={styles.itemCountText}>{order.itemCount} items</Text>

        <Text style={styles.amountText}>₹{order.amount}</Text>
      </View>
    </TouchableOpacity>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F1FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTopText: {
    flex: 1,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemCountText: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});