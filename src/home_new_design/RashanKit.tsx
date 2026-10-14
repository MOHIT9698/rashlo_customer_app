import ItemFormModal, { ItemFormValues } from '@/components/item_form_modal/ItemFormModal';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MAX_FAMILY_SIZE, useProfile } from './ProfileContext';
import { buildRationPlan, getKitQuantity, RationLine } from './Rashan';
// import ItemFormModal, { ItemFormValues } from '../components/ItemFormModal';
// import { useCart } from '../contexts/CartContext';
// import { MAX_FAMILY_SIZE, useProfile } from '../contexts/ProfileContext';
// import { buildRationPlan, getKitQuantity, RationLine } from '../lib/ration';

export default function RationKitScreen() {
  const router = useRouter();
  const { familySize, setFamilySize } = useProfile();
  const { cart, addToCart } = useCart();

  const [members, setMembers] = useState(familySize);
  const [lines, setLines] = useState<RationLine[]>(() => buildRationPlan(familySize));
  const [customModal, setCustomModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const essentials = lines.filter((l) => !l.optional && !l.isCustom);
  const optionals = lines.filter((l) => l.optional && !l.isCustom);
  const customs = lines.filter((l) => l.isCustom);

  const selected = lines.filter((l) => l.included);
  const hasEmptyQuantity = selected.some((l) => l.quantity.trim().length === 0);
  const canAdd = selected.length > 0 && !hasEmptyQuantity && !submitted;

  function changeMembers(next: number) {
    const clamped = Math.min(MAX_FAMILY_SIZE, Math.max(1, next));
    setMembers(clamped);
    setFamilySize(clamped);
    // Recalculate only the lines the customer hasn't touched, so edits they
    // already made are never silently overwritten.
    setLines((prev) =>
      prev.map((l) => {
        if (l.edited || l.isCustom) return l;
        const q = getKitQuantity(l.itemId, clamped);
        return q ? { ...l, quantity: q } : l;
      })
    );
  }

  function toggleLine(key: string) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, included: !l.included } : l)));
  }

  function editQuantity(key: string, quantity: string) {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, quantity, edited: true } : l))
    );
  }

  function removeCustom(key: string) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  function handleAddCustom(values: ItemFormValues) {
    setLines((prev) => [
      ...prev,
      {
        key: `custom-${Date.now()}`,
        itemId: `custom-${Date.now()}`,
        name: values.name,
        icon: '🛒',
        categoryId: 'custom',
        quantity: values.quantity,
        included: true,
        edited: true,
        optional: false,
        brand: values.brand || undefined,
        isCustom: true,
      },
    ]);
    setCustomModal(false);
  }

  function handleAddToCart() {
    if (!canAdd) return;
    setSubmitted(true); // guards against a double tap adding everything twice
    selected.forEach((l) => {
      addToCart({
        itemId: l.itemId,
        itemName: l.name,
        categoryId: l.categoryId,
        brand: l.brand,
        quantity: l.quantity.trim(),
        isCustom: l.isCustom,
      });
    });
    router.replace('/tabs/cart');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly ration</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        {/* Family size */}
        <View style={styles.familyCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.familyTitle}>Family of {members}</Text>
            <Text style={styles.familySubtitle}>
              Amounts are typical monthly estimates. Change anything below.
            </Text>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepperButton, members <= 1 && { opacity: 0.4 }]}
              disabled={members <= 1}
              onPress={() => changeMembers(members - 1)}
            >
              <Ionicons name="remove" size={18} color="#3E9142" />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{members}</Text>
            <TouchableOpacity
              style={[styles.stepperButton, members >= MAX_FAMILY_SIZE && { opacity: 0.4 }]}
              disabled={members >= MAX_FAMILY_SIZE}
              onPress={() => changeMembers(members + 1)}
            >
              <Ionicons name="add" size={18} color="#3E9142" />
            </TouchableOpacity>
          </View>
        </View>

        {cart.length > 0 && (
          <View style={styles.cartNote}>
            <Ionicons name="information-circle-outline" size={16} color="#3B7FB0" />
            <Text style={styles.cartNoteText}>
              You already have items in your cart. These will be added alongside them.
            </Text>
          </View>
        )}

        <Section title="Essentials" lines={essentials} onToggle={toggleLine} onEdit={editQuantity} />
        <Section
          title="Optional extras"
          hint="Not ticked by default — tick what you need"
          lines={optionals}
          onToggle={toggleLine}
          onEdit={editQuantity}
        />
        {customs.length > 0 && (
          <Section
            title="Your additions"
            lines={customs}
            onToggle={toggleLine}
            onEdit={editQuantity}
            onRemove={removeCustom}
          />
        )}

        <TouchableOpacity
          style={styles.addCustomButton}
          activeOpacity={0.8}
          onPress={() => setCustomModal(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#3E9142" />
          <Text style={styles.addCustomText}>Add something else to this list</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        {hasEmptyQuantity && (
          <Text style={styles.errorText}>Every ticked item needs a quantity.</Text>
        )}
        <TouchableOpacity
          style={[styles.primaryButton, !canAdd && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          disabled={!canAdd}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>
            {selected.length === 0
              ? 'Tick at least one item'
              : `Add ${selected.length} ${selected.length === 1 ? 'item' : 'items'} to cart`}
          </Text>
        </TouchableOpacity>
      </View>

      <ItemFormModal
        visible={customModal}
        mode="add"
        onClose={() => setCustomModal(false)}
        onSave={handleAddCustom}
      />
    </SafeAreaView>
  );
}

function Section({
  title,
  hint,
  lines,
  onToggle,
  onEdit,
  onRemove,
}: {
  title: string;
  hint?: string;
  lines: RationLine[];
  onToggle: (key: string) => void;
  onEdit: (key: string, quantity: string) => void;
  onRemove?: (key: string) => void;
}) {
  if (lines.length === 0) return null;

  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      <View style={styles.sectionCard}>
        {lines.map((line, index) => {
          const emptyAndIncluded = line.included && line.quantity.trim().length === 0;
          return (
            <View key={line.key}>
              <View style={[styles.lineRow, !line.included && { opacity: 0.55 }]}>
                <TouchableOpacity
                  onPress={() => onToggle(line.key)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={line.included ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={line.included ? '#3E9142' : '#B0B0B0'}
                  />
                </TouchableOpacity>
                <Text style={styles.lineIcon}>{line.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lineName} numberOfLines={2}>
                    {line.name}
                  </Text>
                  {line.brand ? <Text style={styles.lineBrand}>{line.brand}</Text> : null}
                </View>
                <TextInput
                  style={[styles.qtyInput, emptyAndIncluded && styles.qtyInputError]}
                  value={line.quantity}
                  onChangeText={(t) => onEdit(line.key, t)}
                  placeholder="Qty"
                  placeholderTextColor="#B0B0B0"
                  maxLength={20}
                />
                {onRemove && (
                  <TouchableOpacity
                    onPress={() => onRemove(line.key)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#E03C31" />
                  </TouchableOpacity>
                )}
              </View>
              {index < lines.length - 1 && <View style={styles.lineDivider} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F7F9' },
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
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  content: { padding: 16, paddingBottom: 24 },

  familyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF8E6',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F8E6B8',
  },
  familyTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A' },
  familySubtitle: { fontSize: 12, color: '#7A6A45', marginTop: 3, lineHeight: 16 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 4,
  },
  stepperButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', minWidth: 28, textAlign: 'center' },

  cartNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F1FC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  cartNoteText: { flex: 1, fontSize: 12, color: '#3B7FB0', lineHeight: 16 },

  sectionWrap: { marginTop: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginLeft: 4 },
  sectionHint: { fontSize: 11, color: '#8A8A8A', marginLeft: 4, marginTop: 2 },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 8,
    overflow: 'hidden',
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
  lineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 11 },
  lineIcon: { fontSize: 20 },
  lineName: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  lineBrand: { fontSize: 11, color: '#8A8A8A', marginTop: 1 },
  lineDivider: { height: 1, backgroundColor: '#F2F2F2', marginLeft: 46 },
  qtyInput: {
    width: 78,
    backgroundColor: '#F6F7F9',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 7,
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  qtyInputError: { borderWidth: 1, borderColor: '#E03C31', backgroundColor: '#FDEAEA' },

  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#3E9142',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 20,
  },
  addCustomText: { color: '#3E9142', fontSize: 14, fontWeight: '700' },

  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  errorText: { fontSize: 12, color: '#E03C31', textAlign: 'center', marginBottom: 8 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3E9142',
    borderRadius: 14,
    paddingVertical: 15,
  },
  primaryButtonDisabled: { backgroundColor: '#B9D8BB' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});