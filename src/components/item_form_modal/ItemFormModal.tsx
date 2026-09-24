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

export interface ItemFormValues {
  name: string;
  brand: string;
  quantity: string;
}

interface ItemFormModalProps {
  visible: boolean;
  mode: 'add' | 'edit';
  initialValues?: ItemFormValues;
  onClose: () => void;
  onSave: (values: ItemFormValues) => void;
}

const QUICK_QUANTITIES = ['1kg', '500g', '1L', '500ml', '1 pc'];

const EMPTY: ItemFormValues = { name: '', brand: '', quantity: '' };

export default function ItemFormModal({
  visible,
  mode,
  initialValues,
  onClose,
  onSave,
}: ItemFormModalProps) {
  const [values, setValues] = useState<ItemFormValues>(initialValues ?? EMPTY);

  // Re-sync whenever a different item is opened for editing, or the modal reopens for "add"
  useEffect(() => {
    if (visible) {
      setValues(initialValues ?? EMPTY);
    }
  }, [visible, initialValues]);

  const isValid = values.name.trim().length > 0 && values.quantity.trim().length > 0;

  function handleSave() {
    if (!isValid) return;
    onSave({
      name: values.name.trim(),
      brand: values.brand.trim(),
      quantity: values.quantity.trim(),
    });
  }

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
            <Text style={styles.title}>
              {mode === 'add' ? 'Add a custom item' : 'Edit item'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {mode === 'add' && (
            <Text style={styles.subtitle}>
              Not in our list? Add exactly what you need — the shop will confirm availability.
            </Text>
          )}

          <Text style={styles.label}>Item name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kashmiri Chilli Powder"
            placeholderTextColor="#B0B0B0"
            value={values.name}
            onChangeText={(text) => setValues((v) => ({ ...v, name: text }))}
          />

          <Text style={styles.label}>Brand (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Local shop brand, or leave blank"
            placeholderTextColor="#B0B0B0"
            value={values.brand}
            onChangeText={(text) => setValues((v) => ({ ...v, brand: text }))}
          />

          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1kg, 500ml, 2 pcs"
            placeholderTextColor="#B0B0B0"
            value={values.quantity}
            onChangeText={(text) => setValues((v) => ({ ...v, quantity: text }))}
          />

          <View style={styles.quickRow}>
            {QUICK_QUANTITIES.map((q) => (
              <TouchableOpacity
                key={q}
                style={styles.quickChip}
                onPress={() => setValues((v) => ({ ...v, quantity: q }))}
              >
                <Text style={styles.quickChipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
            activeOpacity={0.85}
            disabled={!isValid}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {mode === 'add' ? 'Add to Cart' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    marginBottom: 16,
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A8A8A',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  quickChip: {
    backgroundColor: '#E8F1FC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B7FB0',
  },
  saveButton: {
    backgroundColor: '#3B7FB0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  saveButtonDisabled: {
    backgroundColor: '#C4D9E8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});