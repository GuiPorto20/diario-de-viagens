import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { colors, shadow } from '../theme/colors';

// Card da lista: miniatura, nome, cidade e status
export default function PlaceItem({ place, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {place.photo ? (
        <Image source={{ uri: place.photo }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.noPhoto]}>
          <Ionicons name="image-outline" size={28} color={colors.primary} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        <View style={styles.cityRow}>
          <Ionicons name="location-sharp" size={14} color={colors.muted} />
          <Text style={styles.city} numberOfLines={1}>
            {place.city} - {place.state}
          </Text>
        </View>
        <StatusBadge status={place.status} />
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    ...shadow,
  },
  thumb: { width: 82, height: 82, borderRadius: 12, backgroundColor: colors.primarySoft },
  noPhoto: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: 12, gap: 6 },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  city: { fontSize: 13, color: colors.muted, flexShrink: 1 },
});
