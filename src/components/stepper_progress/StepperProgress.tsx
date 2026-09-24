import { Colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

interface StepProgressProps {
  currentStep: number;   // 1-based
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              isActive ? styles.segmentActive : styles.segmentInactive,
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  segmentActive: {
    backgroundColor: Colors.primary,
  },
  segmentInactive: {
    backgroundColor: '#E5E9EC',
  },
});