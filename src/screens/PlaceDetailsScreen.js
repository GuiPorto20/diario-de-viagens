import React from 'react';
import { Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import StatusBadge from '../components/StatusBadge';
import { usePlaces } from '../context/PlacesContext';
import { colors, STATUS } from '../theme/colors';

// Tela 3: detalhes, mini mapa, editar / marcar como visitado / remover
export default function PlaceDetailsScreen({ navigation, route }) {
  const { places, updatePlace, removePlace } = usePlaces();
  const place = places.find((p) => p.id === route.params.id);

  // Lugar já removido: nada a mostrar
  if (!place) return null;

  const confirmRemove = () => {
    Alert.alert('Remover lugar', `Deseja remover "${place.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          navigation.goBack();
          removePlace(place.id);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {place.photo && <Image source={{ uri: place.photo }} style={styles.photo} />}
      <Text style={styles.name}>{place.name}</Text>
      <StatusBadge status={place.status} />
      {!!place.description && <Text style={styles.description}>{place.description}</Text>}
      <Text style={styles.address}>
        {place.street}, {place.number} - {place.city}/{place.state}
      </Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: place.latitude, longitude: place.longitude }} title={place.name} />
      </MapView>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Cadastro', { id: place.id })}
      >
        <Text style={styles.btnText}>Editar</Text>
      </TouchableOpacity>
      {place.status !== STATUS.VISITED && (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.visited }]}
          onPress={() => updatePlace(place.id, { status: STATUS.VISITED })}
        >
          <Text style={styles.btnText}>Marcar como Visitado</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.danger }]} onPress={confirmRemove}>
        <Text style={styles.btnText}>Remover</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  photo: { width: '100%', height: 220, borderRadius: 10, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, color: colors.text },
  description: { marginTop: 12, fontSize: 15, color: colors.text },
  address: { marginTop: 8, color: colors.muted },
  map: { height: 180, borderRadius: 10, marginVertical: 16 },
  btn: { padding: 13, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
