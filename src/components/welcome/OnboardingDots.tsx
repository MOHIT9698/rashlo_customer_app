import { StyleSheet, View } from 'react-native';

interface OnboardingDotsProps {
  total: number;
  activeIndex: number;
  activeColor: string;
}

export default function OnboardingDots({ total, activeIndex, activeColor }: OnboardingDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive && { width: 22, backgroundColor: activeColor },
              !isActive && styles.dotInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: '#E0E0E0',
  },
});