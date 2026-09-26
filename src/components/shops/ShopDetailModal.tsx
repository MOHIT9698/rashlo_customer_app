import { formatDistance } from '@/constants/distance';
import { Shop } from '@/constants/shops';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// import { Shop } from '../data/shops';
// import { formatDistance } from '../lib/distance';

interface ShopDetailModalProps {
  visible: boolean;
  shop: Shop | null;
  distanceKm: number;
  isTrusted: boolean;
  onClose: () => void;
  onSetTrusted: () => void;
  onRemoveTrusted: () => void;
}

export default function ShopDetailModal({
  visible,
  shop,
  distanceKm,
  isTrusted,
  onClose,
  onSetTrusted,
  onRemoveTrusted,
}: ShopDetailModalProps) {
  if (!shop) return null;

  const outOfRange = distanceKm > shop.deliveryRadiusKm;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <Text style={styles.iconText}>🏬</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.shopName}>{shop.name}</Text>
              {shop.verified && (
                <Ionicons name="checkmark-circle" size={18} color="#3B7FB0" />
              )}
            </View>
            <Text style={styles.address}>{shop.address}</Text>
          </View>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={22} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="navigate-outline" size={14} color="#3B7FB0" />
            <Text style={styles.metaChipText}>{formatDistance(distanceKm)} away</Text>
          </View>
          <View
            style={[
              styles.metaChip,
              { backgroundColor: shop.openNow ? '#E4F6E9' : '#FDEAEA' },
            ]}
          >
            <Text style={[styles.metaChipText, { color: shop.openNow ? '#1E9E4C' : '#E03C31' }]}>
              {shop.openNow ? 'Open now' : 'Closed'}
            </Text>
          </View>
          {shop.verified && (
            <View style={[styles.metaChip, { backgroundColor: '#E8F1FC' }]}>
              <Text style={[styles.metaChipText, { color: '#3B7FB0' }]}>Verified</Text>
            </View>
          )}
        </View>

        {outOfRange && (
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={16} color="#E8A33D" />
            <Text style={styles.warningText}>
              This shop's usual delivery range is {shop.deliveryRadiusKm}km — you're a bit
              outside that, so delivery may take longer or not be available.
            </Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Usually stocks</Text>
        <View style={styles.categoryRow}>
          {shop.categoriesServed.map((cat) => (
            <View key={cat} style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{cat}</Text>
            </View>
          ))}
        </View>

        {isTrusted ? (
          <TouchableOpacity
            style={styles.trustedActiveButton}
            activeOpacity={0.85}
            onPress={onRemoveTrusted}
          >
            <Ionicons name="star" size={18} color="#FFFFFF" />
            <Text style={styles.trustedActiveText}>Your Trusted Shop · Tap to remove</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.trustedButton}
            activeOpacity={0.85}
            onPress={onSetTrusted}
          >
            <Ionicons name="star-outline" size={18} color="#FFFFFF" />
            <Text style={styles.trustedButtonText}>Set as Trusted Shop</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 30,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  shopName: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  address: { fontSize: 12, color: '#8A8A8A', marginTop: 2 },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F6F7F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaChipText: { fontSize: 12, fontWeight: '600', color: '#1A1A1A' },

  warningBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    alignItems: 'flex-start',
  },
  warningText: { flex: 1, fontSize: 12, color: '#8A6A2E', lineHeight: 17 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A8A8A',
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 8,
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    backgroundColor: '#F6F7F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryChipText: { fontSize: 12, color: '#1A1A1A', textTransform: 'capitalize' },

  trustedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3B7FB0',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 22,
  },
  trustedButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  trustedActiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8A33D',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 22,
  },
  trustedActiveText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});