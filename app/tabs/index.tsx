import AnimatedScreen from '@/components/animated_screen/AnimatedScreen';
import TrustedShop from '@/components/home/TrustedShop';
import CategorySection from '@/components/home_screen/CategorySection';
import PromoBanner from '@/components/home_screen/Promobanner';
import { categories, Category, categorySections } from '@/components/home_screen/rashancategries';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { categories, categorySections, Category } from '../../data/rashanCategories';
// import { useCart } from '../../contexts/CartContext';
// import AnimatedScreen from '../../components/AnimatedScreen';
// import TrustedShopBanner from '../../components/TrustedShopBanner';
// import CartReminderBanner from '../../components/CartReminderBanner';
// import PopularItemsRow from '../../components/PopularItemsRow';
// import PromoBanner from '../../components/PromoBanner';
// import CategorySection from '../../components/CategorySection';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Replace with the logged-in user's real name once auth is wired up
const USER_NAME = 'Rohit';

export default function HomeScreen() {
  const router = useRouter();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const categoriesYRef = useRef(0);

  const cartCount = cart.reduce((sum, c) => sum + c.count, 0);
  const initials = USER_NAME.charAt(0).toUpperCase();

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.trim().toLowerCase();
    return categories.filter((category) => {
      if (category.name.toLowerCase().includes(q)) return true;
      return category.items.some(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.hindiName?.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  function getSectionCategories(section: string): Category[] {
    return filteredCategories.filter((c) => c.section === section);
  }

  function handleShopNow() {
    scrollRef.current?.scrollTo({ y: categoriesYRef.current, animated: true });
  }

  const noResultsAtAll = searchQuery.length > 0 && filteredCategories.length === 0;

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Greeting + avatar */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()} 👋</Text>
              <Text style={styles.headerTitle}>What do you need today?</Text>
            </View>
            <TouchableOpacity
              style={styles.avatar}
              activeOpacity={0.8}
              onPress={() => router.push('/profile')}            >
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          </View>

          {/* Trusted shop status */}
          <TrustedShop />

          {/* Cart reminder, only when relevant */}
          {/* {cartCount > 0 && <CartReminderBanner count={cartCount} />} */}

          {/* Search */}
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#8A8A8A" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for atta, oil, spices..."
              placeholderTextColor="#B0B0B0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>

          {/* Promo banner + popular row hidden while searching, to keep focus on results */}
          {!searchQuery && (
            <>
              <PromoBanner onShopNow={handleShopNow} />
              {/* <PopularItemsRow /> */}
            </>
          )}

          {/* Grouped category sections */}
          <View onLayout={(e) => (categoriesYRef.current = e.nativeEvent.layout.y)}>
            {noResultsAtAll ? (
              <Text style={styles.noResultsText}>
                No categories match "{searchQuery}"
              </Text>
            ) : (
              categorySections.map((section) => (
                <CategorySection
                  key={section}
                  title={section}
                  categoriesList={getSectionCategories(section)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F7F9' },
  scrollContent: { paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  greeting: { fontSize: 13, color: '#8A8A8A' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginTop: 2 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3E9142',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },

  noResultsText: {
    fontSize: 13,
    color: '#8A8A8A',
    textAlign: 'center',
    paddingVertical: 30,
  },
});