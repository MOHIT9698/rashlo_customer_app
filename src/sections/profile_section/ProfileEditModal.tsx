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

interface ProfileEditModalProps {
  visible: boolean;
  initialName: string;
  phone: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

const MAX_NAME_LENGTH = 40;

export default function ProfileEditModal({
  visible,
  initialName,
  phone,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [name, setName] = useState(initialName);

  // Always start from the saved name when the sheet reopens,
  // so a cancelled edit never "sticks" next time.
  useEffect(() => {
    if (visible) setName(initialName);
  }, [visible, initialName]);

  const trimmed = name.trim();
  const isValid = trimmed.length >= 2;

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
            <Text style={styles.title}>Edit profile</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            maxLength={MAX_NAME_LENGTH}
            placeholder="Your name"
            placeholderTextColor="#B0B0B0"
            autoCapitalize="words"
          />
          {!isValid && name.length > 0 && (
            <Text style={styles.errorText}>Please enter at least 2 characters.</Text>
          )}

          <Text style={styles.label}>Phone number</Text>
          <View style={[styles.input, styles.lockedInput]}>
            <Text style={styles.lockedText}>{phone}</Text>
            <Ionicons name="lock-closed-outline" size={16} color="#8A8A8A" />
          </View>
          <Text style={styles.hintText}>
            Your number is your login, so it can only be changed by contacting support.
          </Text>

          <TouchableOpacity
            style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
            activeOpacity={0.85}
            disabled={!isValid}
            onPress={() => onSave(trimmed)}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
  label: { fontSize: 12, fontWeight: '600', color: '#8A8A8A', marginTop: 16, marginBottom: 6 },
  input: {
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  lockedInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lockedText: { fontSize: 15, color: '#8A8A8A' },
  errorText: { fontSize: 11, color: '#E03C31', marginTop: 4 },
  hintText: { fontSize: 11, color: '#8A8A8A', marginTop: 6, lineHeight: 15 },
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