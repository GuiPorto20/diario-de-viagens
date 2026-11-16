import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { statusColor } from '../theme/colors';

// Etiqueta colorida com o status do lugar
export default function StatusBadge({ status }) {
  return (
    <View style={[styles.badge, { backgroundColor: statusColor(status) }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start' },
  text: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
