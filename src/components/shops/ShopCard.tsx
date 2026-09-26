import { formatDistance } from '@/constants/distance';
import { Shop } from '@/constants/shops';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Shop } from '../data/shops';
// import { formatDistance } from '../lib/distance';

interface ShopCardProps {
  shop: Shop;
  distanceKm: number;
  isTrusted: boolean;
  onPress: () => void;
}

export default function ShopCard({ shop, distanceKm, isTrusted, onPress }: ShopCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Text style={styles.iconText}>🏬</Text>
        {isTrusted && (
          <View style={styles.starBadge}>
            <Ionicons name="star" size={10} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={styles.shopName} numberOfLines={1}>
            {shop.name}
          </Text>
          {shop.verified && <Ionicons name="checkmark-circle" size={14} color="#3B7FB0" />}
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {shop.address}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{formatDistance(distanceKm)}</Text>
          <View style={styles.dot} />
          <Text style={[styles.metaText, { color: shop.openNow ? '#1E9E4C' : '#E03C31' }]}>
            {shop.openNow ? 'Open now' : 'Closed'}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18 },
  starBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E8A33D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  shopName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', flexShrink: 1 },
  address: { fontSize: 11, color: '#8A8A8A', marginTop: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  metaText: { fontSize: 11, color: '#8A8A8A', fontWeight: '600' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#C4C4C4' },
});