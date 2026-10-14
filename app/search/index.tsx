import ItemFormModal, { ItemFormValues } from '@/components/item_form_modal/ItemFormModal';
import { useCart } from '@/context/CartContext';
import { getTotalItemCount } from '@/home_new_design/Rashancategories';
import { getPopularItems, searchCatalog, searchCategories, SearchResult } from '@/home_new_design/Search';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import ItemFormModal, { ItemFormValues } from '../components/ItemFormModal';
// import { useCart } from '../contexts/CartContext';
// import { getTotalItemCount } from '../data/rashanCategories';
// import { getPopularItems, searchCatalog, searchCategories, SearchResult } from '../lib/search';

export default function SearchScreen() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [query, setQuery] = useState('');
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customDraftName, setCustomDraftName] = useState('');

  const trimmed = query.trim();
  const results = useMemo(() => searchCatalog(query), [query]);
  const matchingCategories = useMemo(() => searchCategories(query), [query]);
  const popular = useMemo(() => getPopularItems(10), []);

  // Stable object so the modal doesn't reset its fields on every re-render
  const customInitialValues = useMemo(
    () => ({ name: customDraftName, brand: '', quantity: '' }),
    [customDraftName]
  );

  function openItem(result: SearchResult) {
    router.push(`/add-item/${result.category.id}?itemId=${result.item.id}`);
  }

  function openCustom() {
    setCustomDraftName(trimmed);
    setCustomModalVisible(true);
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
    setCustomModalVisible(false);
    Alert.alert('Added to cart', `${values.name} was added as a custom item.`, [
      { text: 'Keep searching', style: 'cancel' },
      { text: 'View cart', onPress: () => router.replace('/tabs/cart') },
    ]);
  }

  const customRow = (
    <TouchableOpacity style={styles.customRow} activeOpacity={0.8} onPress={openCustom}>
      <View style={styles.customIcon}>
        <Ionicons name="add" size={20} color="#3E9142" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.customTitle}>
          {trimmed ? `Add "${trimmed}" as a custom item` : "Can't find it? Add a custom item"}
        </Text>
        <Text style={styles.customSubtitle}>Type any item, brand and quantity</Text>
      </View>
    </TouchableOpacity>
  );

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
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#8A8A8A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, brands, or Hindi names"
            placeholderTextColor="#B0B0B0"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#B0B0B0" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {trimmed.length === 0 ? (
        // Nothing typed yet: show useful starting points instead of a blank screen
        <ScrollView
          contentContainerStyle={styles.suggestContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.suggestTitle}>Popular right now</Text>
          <View style={styles.chipWrap}>
            {popular.map((result) => (
              <TouchableOpacity
                key={result.item.id}
                style={styles.chip}
                activeOpacity={0.8}
                onPress={() => openItem(result)}
              >
                <Text style={styles.chipIcon}>{result.item.icon}</Text>
                <Text style={styles.chipText}>{result.item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.catalogHint}>
            Searching across {getTotalItemCount()}+ items. Try "haldi", "atta" or "Fortune".
          </Text>

          {customRow}
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(r) => r.item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            matchingCategories.length > 0 ? (
              <View style={styles.catHeader}>
                <Text style={styles.suggestTitle}>Categories</Text>
                <View style={styles.chipWrap}>
                  {matchingCategories.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={styles.chip}
                      activeOpacity={0.8}
                      onPress={() => router.push(`/add-item/${c.id}`)}
                    >
                      <Text style={styles.chipIcon}>{c.icon}</Text>
                      <Text style={styles.chipText}>{c.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {results.length > 0 && <Text style={[styles.suggestTitle, { marginTop: 16 }]}>Items</Text>}
              </View>
            ) : null
          }
          ListEmptyComponent={
            matchingCategories.length > 0 ? null : (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>No results for "{trimmed}"</Text>
                <Text style={styles.emptySubtitle}>
                  Check the spelling, try a shorter word, or add it yourself below.
                </Text>
              </View>
            )
          }
          ListFooterComponent={<View style={{ marginTop: 8 }}>{customRow}</View>}
          renderItem={({ item: result }) => (
            <TouchableOpacity style={styles.resultRow} activeOpacity={0.75} onPress={() => openItem(result)}>
              <View style={styles.resultIcon}>
                {result.item.image ? (
                  <Image source={{ uri: result.item.image }} style={styles.resultImage} />
                ) : (
                  <Text style={{ fontSize: 22 }}>{result.item.icon}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultName} numberOfLines={1}>
                  {result.item.name}
                </Text>
                <Text style={styles.resultMeta} numberOfLines={1}>
                  {result.item.hindiName ? `${result.item.hindiName} · ` : ''}
                  {result.category.name}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
            </TouchableOpacity>
          )}
        />
      )}

      <ItemFormModal
        visible={customModalVisible}
        mode="add"
        initialValues={customInitialValues}
        onClose={() => setCustomModalVisible(false)}
        onSave={handleAddCustom}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  backButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A', padding: 0 },

  suggestContent: { padding: 20 },
  suggestTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A1A', marginBottom: 10 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  chipIcon: { fontSize: 15 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#1A1A1A' },
  catalogHint: { fontSize: 12, color: '#8A8A8A', marginTop: 18, marginBottom: 14, lineHeight: 17 },

  listContent: { padding: 16, paddingBottom: 40 },
  catHeader: { marginBottom: 10 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  resultIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  resultImage: { width: '100%', height: '100%' },
  resultName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  resultMeta: { fontSize: 12, color: '#8A8A8A', marginTop: 2 },

  emptyWrap: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  emptySubtitle: { fontSize: 12, color: '#8A8A8A', textAlign: 'center', marginTop: 4, lineHeight: 17 },

  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#3E9142',
  },
  customIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E7F5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  customSubtitle: { fontSize: 11, color: '#8A8A8A', marginTop: 2 },
});