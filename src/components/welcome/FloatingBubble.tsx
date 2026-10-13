import { useEffect } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { OrbitIcon } from './OnboardingSlides';

export default function FloatingBubble({ icon }: { icon: OrbitIcon }) {
  const translateY = useSharedValue(0);
  const size = icon.size ?? 36;

  useEffect(() => {
    translateY.value = withDelay(
      icon.floatDelay ?? 0,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bubble,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top: icon.top,
          left: icon.left,
          right: icon.right,
          bottom: icon.bottom,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.55 }}>{icon.emoji}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
});