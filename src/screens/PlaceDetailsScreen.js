import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import StatusBadge from '../components/StatusBadge';
import { usePlaces } from '../context/PlacesContext';
import { colors, STATUS, statusColor, shadow } from '../theme/colors';

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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {place.photo ? (
        <Image source={{ uri: place.photo }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.noPhoto]}>
          <Ionicons name="image-outline" size={56} color={colors.primary} />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.name}>{place.name}</Text>
          <StatusBadge status={place.status} />
          {!!place.description && <Text style={styles.description}>{place.description}</Text>}
          <View style={styles.addressRow}>
            <Ionicons name="location" size={18} color={statusColor(place.status)} />
            <Text style={styles.address}>
              {place.street}, {place.number}
              {'\n'}
              {place.city} - {place.state}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: place.latitude,
              longitude: place.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              title={place.name}
              pinColor={statusColor(place.status)}
            />
          </MapView>
        </View>

        {place.status !== STATUS.VISITED && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.visited }]}
            onPress={() => updatePlace(place.id, { status: STATUS.VISITED })}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.btnText}>Marcar como Visitado</Text>
          </TouchableOpacity>
        )}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, { flex: 1, backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Cadastro', { id: place.id })}
          >
            <Ionicons name="create" size={19} color="#fff" />
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: colors.danger }]} onPress={confirmRemove}>
            <Ionicons name="trash" size={19} color="#fff" />
            <Text style={styles.btnText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  photo: { width: '100%', height: 240 },
  noPhoto: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 16, marginTop: -28 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 18, marginBottom: 14, gap: 10, ...shadow },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  description: { fontSize: 15, color: colors.text, lineHeight: 22 },
  addressRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 4 },
  address: { color: colors.muted, lineHeight: 20, flex: 1 },
  map: { height: 190 },
  row: { flexDirection: 'row', gap: 10 },
  btn: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
