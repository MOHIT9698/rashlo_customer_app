import AnimatedScreen from '@/components/animated_screen/AnimatedScreen';
import TrustedShop from '@/components/home/TrustedShop';
import CategorySection from '@/components/home_screen/CategorySection';
// import CategorySection from '@/components/home_screen/CategorySection';
import PromoBanner from '@/components/home_screen/Promobanner';
// import { getCategoriesBySection } from '@/components/home_screen/rashancategries';
import { useCart } from '@/context/CartContext';
import OrderAgainRow from '@/home_new_design/OrderAgainRow';
import { getInitials, useProfile } from '@/home_new_design/ProfileContext';
import { categorySections, getCategoriesBySection, getTotalItemCount } from '@/home_new_design/Rashancategories';
// import { categorySections, getCategoriesBySection, getTotalItemCount } from '@/home_new_design/Rashancategories';
import RationPlannerCard from '@/home_new_design/RashanPlannerCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { categorySections, getCategoriesBySection, getTotalItemCount } from '../../data/rashanCategories';
// import { useCart } from '../../contexts/CartContext';
// import { useProfile, getInitials } from '../../contexts/ProfileContext';
// import AnimatedScreen from '../../components/AnimatedScreen';
// import TrustedShopBanner from '../../components/TrustedShopBanner';
// import CartReminderBanner from '../../components/CartReminderBanner';
// import PromoBanner from '../../components/PromoBanner';
// import OrderAgainRow from '../../components/OrderAgainRow';
// import RationPlannerCard from '../../components/RationPlannerCard';
// import PopularItemsRow from '../../components/PopularItemsRow';
// import CategorySection from '../../components/CategorySection';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const { cart } = useCart();
  const { name } = useProfile();
  const scrollRef = useRef<ScrollView>(null);
  const categoriesYRef = useRef(0);

  const cartCount = cart.reduce((sum, c) => sum + c.count, 0);
  const firstName = name.trim().split(' ')[0];

  function handleShopNow() {
    scrollRef.current?.scrollTo({ y: categoriesYRef.current, animated: true });
  }

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
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>
                {getGreeting()}
                {firstName ? `, ${firstName}` : ''} 👋
              </Text>
              <Text style={styles.headerTitle}>What do you need today?</Text>
            </View>
            <TouchableOpacity
              style={styles.avatar}
              activeOpacity={0.8}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.avatarText}>{getInitials(name)}</Text>
            </TouchableOpacity>
          </View>

          {/* 1. Trusted shop */}
          <TrustedShop />

          {/* Cart reminder, only when there is something in the cart */}
          {/* {cartCount > 0 && <CartReminderBanner count={cartCount} />} */}

          {/* Search — opens the full search screen */}
          <TouchableOpacity
            style={styles.searchWrap}
            activeOpacity={0.8}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search" size={18} color="#8A8A8A" />
            <Text style={styles.searchPlaceholder}>
              Search {getTotalItemCount()}+ items, brands...
            </Text>
          </TouchableOpacity>

          {/* 2. Promo banner */}
          <PromoBanner onShopNow={handleShopNow} />

          {/* 3. Order again (returning customers only — hides itself otherwise) */}
          <OrderAgainRow />

          {/* 4. Monthly ration planner */}
          <RationPlannerCard />

          {/* Most ordered items */}
          {/* <PopularItemsRow /> */}

          {/* 5. Categories with photos, grouped under headings */}
          <View onLayout={(e) => (categoriesYRef.current = e.nativeEvent.layout.y)}>
            {categorySections.map((section) => (
              <CategorySection
                key={section}
                title={section}
                categoriesList={getCategoriesBySection(section)}
              />
            ))}
          </View>

          {/* Last-resort path, so nobody is ever stuck */}
          <TouchableOpacity
            style={styles.customCta}
            activeOpacity={0.8}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="help-circle-outline" size={20} color="#3E9142" />
            <View style={{ flex: 1 }}>
              <Text style={styles.customCtaTitle}>Can't find what you need?</Text>
              <Text style={styles.customCtaText}>Search, or add any item yourself.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F7F9' },
  scrollContent: { paddingBottom: 28 },

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
  avatarText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchPlaceholder: { fontSize: 14, color: '#B0B0B0' },

  customCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 26,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#3E9142',
  },
  customCtaTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  customCtaText: { fontSize: 11, color: '#8A8A8A', marginTop: 2 },
});