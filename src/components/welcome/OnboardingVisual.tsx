import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import FloatingBubble from './FloatingBubble';
import { OnboardingSlide } from './OnboardingSlides';

export default function OnboardingVisual({ slide }: { slide: OnboardingSlide }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.wrap}>
      <View style={[styles.backdrop, { backgroundColor: slide.bgColor }]} />
      <View style={styles.backdropInner} />

      <Animated.View style={[styles.centerWrap, pulseStyle]}>
        <Text style={styles.centerEmoji}>{slide.centerEmoji}</Text>
      </Animated.View>

      {slide.orbitIcons.map((icon, index) => (
        <FloatingBubble key={index} icon={icon} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  backdropInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  centerWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerEmoji: {
    fontSize: 54,
  },
});