import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlaceItem from '../components/PlaceItem';
import { usePlaces } from '../context/PlacesContext';
import { colors, STATUS, shadow } from '../theme/colors';

// Tela 1: lista de lugares + botão para adicionar
export default function PlacesListScreen({ navigation }) {
  const { places } = usePlaces();
  const visited = places.filter((p) => p.status === STATUS.VISITED).length;

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 110 }}
        ListHeaderComponent={
          places.length > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Seu diário de viagens</Text>
              <Text style={styles.summaryText}>
                {places.length} {places.length === 1 ? 'lugar' : 'lugares'} · {visited} visitado{visited === 1 ? '' : 's'} ·{' '}
                {places.length - visited} na lista de desejos
              </Text>
            </View>
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIcon}>
              <Ionicons name="airplane" size={44} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Nenhum lugar ainda</Text>
            <Text style={styles.emptyText}>Toque em "Novo lugar" para registrar o primeiro destino do seu diário.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PlaceItem place={item} onPress={() => navigation.navigate('Detalhes', { id: item.id })} />
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Cadastro')} activeOpacity={0.85}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.fabText}>Novo lugar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  summary: {
    backgroundColor: colors.primary,
    margin: 16,
    marginBottom: 8,
    padding: 18,
    borderRadius: 18,
    ...shadow,
  },
  summaryTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  summaryText: { color: '#D7F0F2', marginTop: 4, fontSize: 13 },
  emptyBox: { alignItems: 'center', marginTop: 70, paddingHorizontal: 40 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 18 },
  emptyText: { textAlign: 'center', color: colors.muted, marginTop: 8, lineHeight: 21 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    ...shadow,
    shadowOpacity: 0.25,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
