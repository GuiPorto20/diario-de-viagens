import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { usePlaces } from '../context/PlacesContext';
import useLocation from '../hooks/useLocation';
import { statusColor } from '../theme/colors';

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
      {!!errorMsg && <Text style={styles.warn}>{errorMsg}</Text>}
      <MapView style={styles.map} initialRegion={region}>
        {location && <Marker coordinate={location} title="Você está aqui" pinColor="#1976d2" />}
        {places.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            description={p.status}
            pinColor={statusColor(p.status)}
            onCalloutPress={() => navigation.navigate('Detalhes', { id: p.id })}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  warn: { backgroundColor: '#fff3cd', padding: 8, textAlign: 'center', color: '#7a5b00' },
});
