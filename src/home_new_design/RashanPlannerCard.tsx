import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MAX_FAMILY_SIZE, useProfile } from './ProfileContext';
// import { MAX_FAMILY_SIZE, useProfile } from '../contexts/ProfileContext';

export default function RationPlannerCard() {
  const router = useRouter();
  const { familySize, setFamilySize } = useProfile();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Monthly ration, made easy</Text>
          <Text style={styles.subtitle}>
            Tell us your family size and we'll suggest a ready list. Edit anything you like.
          </Text>
        </View>
        <Text style={styles.emoji}>👨‍👩‍👧‍👦</Text>
      </View>

      <View style={styles.controlsRow}>
        <Text style={styles.label}>Family members</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={[styles.stepperButton, familySize <= 1 && { opacity: 0.4 }]}
            disabled={familySize <= 1}
            onPress={() => setFamilySize(familySize - 1)}
          >
            <Ionicons name="remove" size={18} color="#3E9142" />
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{familySize}</Text>
          <TouchableOpacity
            style={[styles.stepperButton, familySize >= MAX_FAMILY_SIZE && { opacity: 0.4 }]}
            disabled={familySize >= MAX_FAMILY_SIZE}
            onPress={() => setFamilySize(familySize + 1)}
          >
            <Ionicons name="add" size={18} color="#3E9142" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => router.push('/ration-kit')}
      >
        <Text style={styles.buttonText}>Create my ration list</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF8E6',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#F8E6B8',
    ...Platform.select({
      ios: {
        shadowColor: '#E8A33D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 12, color: '#7A6A45', marginTop: 4, lineHeight: 17 },
  emoji: { fontSize: 38 },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  label: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 4,
  },
  stepperButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', minWidth: 30, textAlign: 'center' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3E9142',
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 16,
  },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});