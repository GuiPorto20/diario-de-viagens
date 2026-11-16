import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';
import { colors } from '../theme/colors';

// Linha da lista: miniatura, nome, cidade e status
export default function PlaceItem({ place, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {place.photo ? (
        <Image source={{ uri: place.photo }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.noPhoto]}>
          <Text style={styles.noPhotoText}>Sem foto</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
        <Text style={styles.city}>{place.city} - {place.state}</Text>
        <StatusBadge status={place.status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 6,
    elevation: 2,
  },
  thumb: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#ddd' },
  noPhoto: { alignItems: 'center', justifyContent: 'center' },
  noPhotoText: { fontSize: 11, color: colors.muted },
  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  city: { fontSize: 13, color: colors.muted },
});
