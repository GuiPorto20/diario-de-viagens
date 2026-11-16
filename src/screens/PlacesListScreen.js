import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import PlaceItem from '../components/PlaceItem';
import { usePlaces } from '../context/PlacesContext';
import { colors } from '../theme/colors';

// Tela 1: lista de lugares + botão para adicionar
export default function PlacesListScreen({ navigation }) {
  const { places } = usePlaces();

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 90 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum lugar cadastrado ainda.{'\n'}Toque no botão + para adicionar.
          </Text>
        }
        renderItem={({ item }) => (
          <PlaceItem place={item} onPress={() => navigation.navigate('Detalhes', { id: item.id })} />
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: { textAlign: 'center', marginTop: 60, color: colors.muted, fontSize: 15, lineHeight: 22 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 32, marginTop: -2 },
});
