import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PromoBanner({ onShopNow }: { onShopNow: () => void }) {
  return (
    <View style={styles.banner}>
      <View style={styles.textCol}>
        <Text style={styles.heading}>Fresh Groceries{'\n'}Delivered to Your Door</Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onShopNow}>
          <Text style={styles.buttonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.visualWrap}>
        <Text style={styles.visualEmoji}>🧺</Text>
        <View style={[styles.floatChip, { top: 4, left: -6 }]}>
          <Text style={styles.floatChipText}>🥦</Text>
        </View>
        <View style={[styles.floatChip, { top: -2, right: -10 }]}>
          <Text style={styles.floatChipText}>🍅</Text>
        </View>
        <View style={[styles.floatChip, { bottom: 0, right: -4 }]}>
          <Text style={styles.floatChipText}>🥛</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3E9142',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    overflow: 'hidden',
  },
  textCol: {
    flex: 1,
  },
  heading: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 25,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: { elevation: 2 },
    }),
  },
  buttonText: {
    color: '#3E9142',
    fontSize: 14,
    fontWeight: '700',
  },
  visualWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualEmoji: {
    fontSize: 52,
  },
  floatChip: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatChipText: {
    fontSize: 14,
  },
});