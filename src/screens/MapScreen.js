import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { usePlaces } from '../context/PlacesContext';
import useLocation from '../hooks/useLocation';
import { colors, STATUS, statusColor, shadow } from '../theme/colors';

// Tela 4: mapa com um marcador por lugar e a localização atual do usuário
export default function MapScreen({ navigation }) {
  const { places } = usePlaces();
  const { location, errorMsg } = useLocation();

  // Centro inicial: usuário > primeiro lugar > centro do Brasil
  const center =
    location ?? (places[0] && { latitude: places[0].latitude, longitude: places[0].longitude });
  const region = center
    ? { ...center, latitudeDelta: 0.5, longitudeDelta: 0.5 }
    : { latitude: -15.78, longitude: -47.93, latitudeDelta: 30, longitudeDelta: 30 };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        {location && <Marker coordinate={location} title="Você está aqui" pinColor="#2563EB" />}
        {places.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            description={`${p.status} · toque para ver detalhes`}
            pinColor={statusColor(p.status)}
            onCalloutPress={() => navigation.navigate('Detalhes', { id: p.id })}
          />
        ))}
      </MapView>

      {!!errorMsg && (
        <View style={styles.warn}>
          <Ionicons name="warning" size={16} color="#92400E" />
          <Text style={styles.warnText}>{errorMsg}</Text>
        </View>
      )}

      {/* Legenda das cores dos marcadores */}
      <View style={styles.legend}>
        {[
          { label: STATUS.WANT, color: colors.wantToVisit },
          { label: STATUS.VISITED, color: colors.visited },
          { label: 'Você', color: '#2563EB' },
        ].map((i) => (
          <View key={i.label} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: i.color }]} />
            <Text style={styles.legendText}>{i.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  warn: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 12,
  },
  warnText: { color: '#92400E', flex: 1, fontSize: 13 },
  legend: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    ...shadow,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: '600', color: colors.text },
});
