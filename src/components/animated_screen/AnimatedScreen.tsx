import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AnimatedScreenProps {
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * Wrap a tab screen's root content with this to get a smooth
 * fade + slight upward slide whenever the screen comes into focus,
 * instead of the default instant snap between tabs.
 */
export default function AnimatedScreen({ children, style }: AnimatedScreenProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(820).withInitialValues({ transform: [{ translateY: 2 }] })}
      style={[styles.flex, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});