import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { statusColor, statusIcon } from '../theme/colors';

// Etiqueta colorida com ícone e o status do lugar
export default function StatusBadge({ status }) {
  const color = statusColor(status);
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <Ionicons name={statusIcon(status)} size={13} color={color} />
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '700' },
});
