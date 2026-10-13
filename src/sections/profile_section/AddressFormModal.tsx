import { AddressLabel } from '@/context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export interface AddressFormValues {
  label: AddressLabel;
  text: string;
}

interface AddressFormModalProps {
  visible: boolean;
  mode: 'add' | 'edit';
  initialValues?: AddressFormValues;
  onClose: () => void;
  onSave: (values: AddressFormValues) => void;
}

const LABELS: { value: AddressLabel; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'Home', icon: 'home-outline' },
  { value: 'Work', icon: 'briefcase-outline' },
  { value: 'Other', icon: 'location-outline' },
];

const MIN_ADDRESS_LENGTH = 10;

export default function AddressFormModal({
  visible,
  mode,
  initialValues,
  onClose,
  onSave,
}: AddressFormModalProps) {
  const [label, setLabel] = useState<AddressLabel>('Home');
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible) {
      setLabel(initialValues?.label ?? 'Home');
      setText(initialValues?.text ?? '');
    }
  }, [visible, initialValues]);

  const trimmed = text.trim();
  const isValid = trimmed.length >= MIN_ADDRESS_LENGTH;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>{mode === 'add' ? 'Add address' : 'Edit address'}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Save as</Text>
          <View style={styles.labelRow}>
            {LABELS.map((item) => {
              const active = item.value === label;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.labelChip, active && styles.labelChipActive]}
                  onPress={() => setLabel(item.value)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={item.icon} size={15} color={active ? '#FFFFFF' : '#3E9142'} />
                  <Text style={[styles.labelChipText, active && { color: '#FFFFFF' }]}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Full address</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={text}
            onChangeText={setText}
            placeholder="House no., street, area, city"
            placeholderTextColor="#B0B0B0"
            multiline
            textAlignVertical="top"
            maxLength={200}
          />
          {text.length > 0 && !isValid ? (
            <Text style={styles.errorText}>
              Please enter a fuller address so the shop can find you.
            </Text>
          ) : (
            <Text style={styles.hintText}>
              We use this to find shops that deliver to you.
            </Text>
          )}

          <TouchableOpacity
            style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
            activeOpacity={0.85}
            disabled={!isValid}
            onPress={() => onSave({ label, text: trimmed })}
          >
            <Text style={styles.saveButtonText}>
              {mode === 'add' ? 'Save Address' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  label: { fontSize: 12, fontWeight: '600', color: '#8A8A8A', marginTop: 16, marginBottom: 8 },
  labelRow: { flexDirection: 'row', gap: 8 },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E7F5E6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  labelChipActive: { backgroundColor: '#3E9142' },
  labelChipText: { fontSize: 13, fontWeight: '600', color: '#3E9142' },
  input: {
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  multiline: { minHeight: 90 },
  errorText: { fontSize: 11, color: '#E03C31', marginTop: 6 },
  hintText: { fontSize: 11, color: '#8A8A8A', marginTop: 6 },
  saveButton: {
    backgroundColor: '#3E9142',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  saveButtonDisabled: { backgroundColor: '#B9D8BB' },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});