import AnimatedScreen from '@/components/animated_screen/AnimatedScreen';
import ItemFormModal, { ItemFormValues } from '@/components/item_form_modal/ItemFormModal';
import { getCategoryById } from '@/constants/RashanCategories';
import { Colors } from '@/constants/theme';
import { CartEntry, useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const { cart, addToCart, updateCartItem, removeFromCart } = useCart();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CartEntry | null>(null);

  const totalPacks = cart.reduce((sum, c) => sum + c.count, 0);

  function handleIncrement(item: CartEntry) {
    updateCartItem(item.id, { count: item.count + 1 });
  }

  function handleDecrement(item: CartEntry) {
    if (item.count <= 1) {
      // Decrementing the last unit removes the line — this mirrors how most
      // shopping apps behave, so it doesn't need a confirmation dialog.
      removeFromCart(item.id);
      return;
    }
    updateCartItem(item.id, { count: item.count - 1 });
  }

  function handleDeletePress(item: CartEntry) {
    // The dedicated delete button is a more deliberate action than the
    // stepper, so it's worth a confirmation — protects against an
    // accidental tap wiping out a whole line (especially count > 1).
    Alert.alert(
      'Remove item?',
      `Remove "${item.itemName}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id) },
      ]
    );
  }

  function handleAddCustom(values: ItemFormValues) {
    addToCart({
      itemId: `custom-${Date.now()}`,
      itemName: values.name,
      categoryId: 'custom',
      brand: values.brand || undefined,
      quantity: values.quantity,
      isCustom: true,
    });
    setAddModalVisible(false);
  }

  function handleSaveEdit(values: ItemFormValues) {
    if (!editingItem) return;
    updateCartItem(editingItem.id, {
      itemName: values.name,
      brand: values.brand || undefined,
      quantity: values.quantity,
    });
    setEditingItem(null);
  }

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart</Text>
          {cart.length > 0 && (
            <Text style={styles.headerCount}>
              {totalPacks} {totalPacks === 1 ? 'item' : 'items'}
            </Text>
          )}
        </View>

        {cart.length === 0 ? (
          <EmptyCart onBrowse={() => router.push('/tabs')} />
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CartCard
                item={item}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() => handleDecrement(item)}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDeletePress(item)}
              />
            )}
          />
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addCustomButton}
            activeOpacity={0.8}
            onPress={() => setAddModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.addCustomButtonText}>Add a custom item</Text>
          </TouchableOpacity>

          {cart.length > 0 && (
            <TouchableOpacity style={styles.placeOrderButton} activeOpacity={0.85}>
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          )}
        </View>

        <ItemFormModal
          visible={addModalVisible}
          mode="add"
          onClose={() => setAddModalVisible(false)}
          onSave={handleAddCustom}
        />

        <ItemFormModal
          visible={!!editingItem}
          mode="edit"
          initialValues={
            editingItem
              ? {
                  name: editingItem.itemName,
                  brand: editingItem.brand ?? '',
                  quantity: editingItem.quantity,
                }
              : undefined
          }
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
        />
      </SafeAreaView>
    </AnimatedScreen>
  );
}

function CartCard({
  item,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: {
  item: CartEntry;
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const category = getCategoryById(item.categoryId);
  const icon = category?.icon ?? '🛒';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.itemName}
            </Text>
            {item.isCustom && (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>Custom</Text>
              </View>
            )}
          </View>

          <Text style={styles.metaText} numberOfLines={1}>
            {item.brand ? `${item.brand} · ` : ''}
            {item.quantity}
          </Text>
        </View>

        <TouchableOpacity onPress={onEdit} style={styles.iconButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="pencil-outline" size={18} color="#8A8A8A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={18} color="#E03C31" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottom}>
        <Text style={styles.packLabel}>Packs</Text>
        <View style={styles.stepper}>
          <TouchableOpacity onPress={onDecrement} style={styles.stepperButton}>
            <Ionicons name="remove" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{item.count}</Text>
          <TouchableOpacity onPress={onIncrement} style={styles.stepperButton}>
            <Ionicons name="add" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function EmptyCart({ onBrowse }: { onBrowse: () => void }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Browse categories to start adding items, or add something custom.
      </Text>
      <TouchableOpacity style={styles.browseButton} activeOpacity={0.85} onPress={onBrowse}>
        <Text style={styles.browseButtonText}>Browse Categories</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  headerCount: { fontSize: 13, color: '#8A8A8A', fontWeight: '600' },
  listContent: { padding: 16, paddingBottom: 8 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', flexShrink: 1 },
  customBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  customBadgeText: { fontSize: 9, fontWeight: '700', color: '#E8A33D' },
  metaText: { fontSize: 12, color: '#8A8A8A', marginTop: 2 },
  iconButton: { padding: 4 },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  packLabel: { fontSize: 12, color: '#8A8A8A' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1FC',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  stepperButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    minWidth: 22,
    textAlign: 'center',
  },

  footer: {
    padding: 16,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    borderStyle: 'dashed',
  },
  addCustomButtonText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  placeOrderText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#8A8A8A', textAlign: 'center', marginBottom: 20 },
  browseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  browseButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});