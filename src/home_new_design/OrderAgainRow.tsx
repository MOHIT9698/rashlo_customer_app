import { Order, orders } from '@/constants/ordersData';
import { Ionicons } from '@expo/vector-icons';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useReorder } from './Reorder';
// import { Order, orders } from '../data/orders';
// import { useReorder } from '../lib/reorder';

export default function OrderAgainRow() {
  const reorder = useReorder();

  // Only delivered orders can be repeated. A first-time customer, or one whose
  // orders were all cancelled, simply never sees this section.
  const reorderable = orders.filter((o) => o.status === 'Delivered').slice(0, 4);
  if (reorderable.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order again</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {reorderable.map((order) => (
          <OrderCard key={order.id} order={order} onReorder={() => reorder(order)} />
        ))}
      </ScrollView>
    </View>
  );
}

function OrderCard({ order, onReorder }: { order: Order; onReorder: () => void }) {
  const firstTwo = order.items.slice(0, 2).map((i) => i.name);
  const extra = order.items.length - firstTwo.length;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.iconWrap}>
          <Ionicons name="repeat" size={16} color="#3E9142" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopName} numberOfLines={1}>
            {order.shopName}
          </Text>
          <Text style={styles.date}>{order.date.split(',')[0]}</Text>
        </View>
      </View>

      <Text style={styles.items} numberOfLines={2}>
        {firstTwo.join(', ')}
        {extra > 0 ? ` +${extra} more` : ''}
      </Text>

      <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onReorder}>
        <Text style={styles.buttonText}>Reorder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 22 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginLeft: 20, marginBottom: 10 },
  row: { paddingHorizontal: 20, gap: 12 },
  card: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E7F5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  date: { fontSize: 11, color: '#8A8A8A', marginTop: 1 },
  items: { fontSize: 12, color: '#6B6B6B', lineHeight: 17, marginTop: 10, minHeight: 34 },
  button: {
    backgroundColor: '#3E9142',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});