import StepProgress from '@/components/stepper_progress/StepperProgress';
import { CategoryItem, getCategoryById } from '@/constants/RashanCategories';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { getCategoryById, CategoryItem } from '../../data/rashanCategories';
// import { useCart } from '../../contexts/CartContext';
// import StepProgress from '../../components/StepProgress';

type StepKey = 'type' | 'brand' | 'quantity' | 'confirm';

export default function AddItemFlow() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const category = getCategoryById(categoryId);

  // All selection state lives only in this component. Because this screen
  // is presented as a modal route, navigating away (cancel, swipe-down,
  // hardware back) unmounts it entirely — so there's nothing to manually
  // "reset". Reopening the flow always starts fresh by design.
  const [step, setStep] = useState<StepKey>('type');
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<string | null>(null);

  // Real-world guard: an item might be flagged hasBrandOptions but have an
  // empty/missing brand list (bad data upstream) — don't let that break the flow.
  const itemHasBrandStep = !!(
    selectedItem?.hasBrandOptions && selectedItem.commonBrands?.length
  );

  const totalSteps = itemHasBrandStep ? 4 : 3;

  function getStepNumber(): number {
    switch (step) {
      case 'type':
        return 1;
      case 'brand':
        return 2;
      case 'quantity':
        return itemHasBrandStep ? 3 : 2;
      case 'confirm':
        return itemHasBrandStep ? 4 : 3;
    }
  }

  if (!category) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Category not found.</Text>
      </SafeAreaView>
    );
  }

  function handleSelectType(item: CategoryItem) {
    setSelectedItem(item);
    setSelectedBrand(null);
    setSelectedQuantity(null);
    const hasBrand = item.hasBrandOptions && !!item.commonBrands?.length;
    setStep(hasBrand ? 'brand' : 'quantity');
  }

  function handleSelectBrand(brand: string) {
    setSelectedBrand(brand);
    setStep('quantity');
  }

  function handleSelectQuantity(qty: string) {
    setSelectedQuantity(qty);
    setStep('confirm');
  }

  function handleBack() {
    if (step === 'type') {
      router.back(); // cancels the whole flow, modal unmounts, state is gone
      return;
    }
    if (step === 'brand') {
      setStep('type');
      return;
    }
    if (step === 'quantity') {
      setStep(itemHasBrandStep ? 'brand' : 'type');
      return;
    }
    if (step === 'confirm') {
      setStep('quantity');
    }
  }

  function handleConfirmAdd() {
    if (!selectedItem || !selectedQuantity) return; // guard: shouldn't happen, but don't add incomplete data
    addToCart({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      categoryId: category.id ,
      brand: itemHasBrandStep ? selectedBrand ?? undefined : undefined,
      quantity: selectedQuantity,
    });
    router.back(); // closes modal, returns to category grid to add the next item fast
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {category.icon} {category.name}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <StepProgress currentStep={getStepNumber()} totalSteps={totalSteps} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'type' && (
          <Animated.View entering={FadeInRight.duration(200)} exiting={FadeOutLeft.duration(150)}>
            <Text style={styles.stepTitle}>What kind of {category.name.toLowerCase()}?</Text>
            <Text style={styles.stepSubtitle}>Tap one to continue</Text>

            {category.items.length === 0 ? (
              <Text style={styles.emptyText}>
                No items set up in this category yet.
              </Text>
            ) : (
              category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionCard}
                  activeOpacity={0.7}
                  onPress={() => handleSelectType(item)}
                >
                  <Text style={styles.optionIcon}>{item.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>{item.name}</Text>
                    {item.hindiName && (
                      <Text style={styles.optionSubtitle}>{item.hindiName}</Text>
                    )}
                  </View>
                  {item.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>Popular</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
                </TouchableOpacity>
              ))
            )}
          </Animated.View>
        )}

        {step === 'brand' && selectedItem && (
          <Animated.View entering={FadeInRight.duration(200)} exiting={FadeOutLeft.duration(150)}>
            <Text style={styles.stepTitle}>Preferred brand?</Text>
            <Text style={styles.stepSubtitle}>For {selectedItem.name}</Text>

            <View style={styles.chipWrap}>
              {selectedItem.commonBrands?.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  style={styles.chip}
                  activeOpacity={0.7}
                  onPress={() => handleSelectBrand(brand)}
                >
                  <Text style={styles.chipText}>{brand}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 'quantity' && selectedItem && (
          <Animated.View entering={FadeInRight.duration(200)} exiting={FadeOutLeft.duration(150)}>
            <Text style={styles.stepTitle}>How much do you need?</Text>
            <Text style={styles.stepSubtitle}>
              {selectedItem.name}
              {selectedBrand ? ` · ${selectedBrand}` : ''}
            </Text>

            <View style={styles.chipWrap}>
              {selectedItem.quantityOptions.map((qty) => (
                <TouchableOpacity
                  key={qty}
                  style={[
                    styles.chip,
                    qty === selectedItem.defaultQuantity && styles.chipRecommended,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleSelectQuantity(qty)}
                >
                  <Text style={styles.chipText}>{qty}</Text>
                  {qty === selectedItem.defaultQuantity && (
                    <Text style={styles.chipRecommendedLabel}>Most common</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 'confirm' && selectedItem && selectedQuantity && (
          <Animated.View entering={FadeInRight.duration(200)} exiting={FadeOutLeft.duration(150)}>
            <Text style={styles.stepTitle}>Confirm item</Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Item</Text>
                <View style={styles.summaryValueRow}>
                  <Text style={styles.summaryValue}>{selectedItem.name}</Text>
                  <TouchableOpacity onPress={() => setStep('type')}>
                    <Text style={styles.editLink}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {itemHasBrandStep && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Brand</Text>
                  <View style={styles.summaryValueRow}>
                    <Text style={styles.summaryValue}>{selectedBrand}</Text>
                    <TouchableOpacity onPress={() => setStep('brand')}>
                      <Text style={styles.editLink}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Quantity</Text>
                <View style={styles.summaryValueRow}>
                  <Text style={styles.summaryValue}>{selectedQuantity}</Text>
                  <TouchableOpacity onPress={() => setStep('quantity')}>
                    <Text style={styles.editLink}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={styles.confirmHint}>
              You can still edit or remove this from your cart later.
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {step === 'confirm' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.85} onPress={handleConfirmAdd}>
            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingVertical: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#8A8A8A',
    marginBottom: 18,
  },
  emptyText: {
    fontSize: 14,
    color: '#8A8A8A',
    marginTop: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
  },
  popularBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E8A33D',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: '30%',
    alignItems: 'center',
  },
  chipRecommended: {
    backgroundColor: '#E8F1FC',
    borderWidth: 1,
    borderColor:Colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  chipRecommendedLabel: {
    fontSize: 10,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#F6F7F9',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  summaryRow: {
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  editLink: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  confirmHint: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 14,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});