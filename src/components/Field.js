import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Campo de formulário com rótulo e ícone
export default function Field({ label, icon, style, multiline, ...props }) {
  return (
    <View style={[{ marginTop: 12 }, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, multiline && { alignItems: 'flex-start' }]}>
        <Ionicons name={icon} size={18} color={colors.primary} style={multiline && { marginTop: 12 }} />
        <TextInput
          style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
          placeholderTextColor="#9AABAE"
          multiline={multiline}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 5 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 11, paddingLeft: 10, fontSize: 15, color: colors.text },
});
