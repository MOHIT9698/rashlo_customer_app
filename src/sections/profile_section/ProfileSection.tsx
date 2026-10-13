import { Ionicons } from '@expo/vector-icons';
import { Children, ReactNode } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ---------- Section card ----------

export function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
  const items = Children.toArray(children);

  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {items.map((child, index) => (
          <View key={index}>
            {child}
            {index < items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------- Row ----------

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export function SettingRow({
  icon,
  label,
  subtitle,
  onPress,
  right,
  destructive,
  disabled,
}: SettingRowProps) {
  const tint = destructive ? '#E03C31' : '#3E9142';
  const tintBg = destructive ? '#FDEAEA' : '#E7F5E6';

  const content = (
    <View style={[styles.row, disabled && { opacity: 0.5 }]}>
      <View style={[styles.rowIcon, { backgroundColor: tintBg }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, destructive && { color: '#E03C31' }]}>{label}</Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ??
        (onPress && !disabled ? (
          <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
        ) : null)}
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionWrap: { marginTop: 22, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A8A8A',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  divider: { height: 1, backgroundColor: '#F2F2F2', marginLeft: 62 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  rowSubtitle: { fontSize: 12, color: '#8A8A8A', marginTop: 2 },
});