import OnboardingDots from '@/components/welcome/OnboardingDots';
import { OnboardingSlide, onboardingSlides } from '@/components/welcome/OnboardingSlides';
import OnboardingVisual from '@/components/welcome/OnboardingVisual';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRAND_GREEN = '#3E9142';

export default function OnboardingScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboardingSlides.length - 1;

  function goToLogin() {
    router.push('/tabs');
  }

  function handleNext() {
    if (isLastSlide) {
      goToLogin();
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  }

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeIndex) setActiveIndex(index);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Skip — jumps straight to login, hidden once already on the last slide */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={goToLogin} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={listRef}
        data={onboardingSlides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }: { item: OnboardingSlide }) => (
          <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <OnboardingVisual slide={item} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <OnboardingDots
          total={onboardingSlides.length}
          activeIndex={activeIndex}
          activeColor={BRAND_GREEN}
        />

        <TouchableOpacity style={styles.nextButton} activeOpacity={0.88} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>

        {isLastSlide && (
          <TouchableOpacity style={styles.loginRow} activeOpacity={0.7} onPress={goToLogin}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 18,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8A8A',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 32,
    marginTop: 28,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
    paddingHorizontal: 6,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 20,
  },
  nextButton: {
    width: '100%',
    backgroundColor: BRAND_GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: BRAND_GREEN,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginRow: {
    paddingVertical: 4,
  },
  loginText: {
    fontSize: 13,
    color: '#7A7A7A',
  },
  loginLink: {
    color: BRAND_GREEN,
    fontWeight: '700',
  },
});