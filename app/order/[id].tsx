import { getOrderById, OrderStatus } from '@/constants/ordersData';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Platform,
    ScrollView,
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

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const order = getOrderById(id);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Order not found.</Text>
      </SafeAreaView>
    );
  }

  const statusStyle = STATUS_STYLES[order.status];
  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);

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
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status + shop card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {order.status}
              </Text>
            </View>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowAlign}>
            <View style={styles.shopIconWrap}>
              <Ionicons name="storefront-outline" size={20} color="#3B7FB0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shopName}>{order.shopName}</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={13} color="#8A8A8A" />
                <Text style={styles.dateText}>{order.date}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items */}
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.card}>
          {order.items.map((item, index) => (
            <View key={item.name}>
              <View style={styles.itemRow}>
                <View style={styles.itemQtyBadge}>
                  <Text style={styles.itemQtyText}>{item.qty}x</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
              </View>
              {index < order.items.length - 1 && (
                <View style={styles.itemDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Price summary */}
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹{order.deliveryFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.amount}</Text>
          </View>
          <View style={styles.paymentMethodRow}>
            <Ionicons name="card-outline" size={15} color="#8A8A8A" />
            <Text style={styles.paymentMethodText}>{order.paymentMethod}</Text>
          </View>
        </View>

        {/* Delivery address */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.card}>
          <View style={styles.rowAlign}>
            <Ionicons name="location-outline" size={18} color="#3B7FB0" />
            <Text style={styles.addressText}>{order.deliveryAddress}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: '#8A8A8A',
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  orderNumber: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  shopIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F1FC',
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A8A8A',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemQtyBadge: {
    backgroundColor: '#F6F7F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  itemQtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B7FB0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8A8A8A',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B7FB0',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  paymentMethodText: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
});