import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { usePlaces } from '../context/PlacesContext';
import { colors, STATUS } from '../theme/colors';

// Tela 2: cadastro (e edição, quando recebe params.id) de lugar
export default function AddPlaceScreen({ navigation, route }) {
  const { places, addPlace, updatePlace } = usePlaces();
  const editing = places.find((p) => p.id === route.params?.id);

  const [name, setName] = useState(editing?.name ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [street, setStreet] = useState(editing?.street ?? '');
  const [number, setNumber] = useState(editing?.number ?? '');
  const [city, setCity] = useState(editing?.city ?? '');
  const [state, setState] = useState(editing?.state ?? '');
  const [status, setStatus] = useState(editing?.status ?? STATUS.WANT);
  const [photo, setPhoto] = useState(editing?.photo ?? null);
  const [saving, setSaving] = useState(false);

  // Tira a foto na hora e salva na galeria do dispositivo
  const takePhoto = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (!cam.granted) {
      Alert.alert('Permissão negada', 'Permita o acesso à câmera para tirar fotos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    setPhoto(uri);

    const lib = await MediaLibrary.requestPermissionsAsync();
    if (!lib.granted) {
      Alert.alert('Permissão negada', 'Sem acesso à galeria, a foto não será salva no dispositivo.');
      return;
    }
    try {
      await MediaLibrary.saveToLibraryAsync(uri);
    } catch (e) {
      Alert.alert('Aviso', 'Não foi possível salvar a foto na galeria.');
    }
  };

  // Escolhe uma foto já existente na galeria
  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissão negada', 'Permita o acesso à galeria para escolher fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const save = async () => {
    if (!name.trim() || !street.trim() || !number.trim() || !city.trim() || !state.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, rua, número, cidade e estado.');
      return;
    }
    setSaving(true);
    try {
      // Endereço -> latitude/longitude
      const fullAddress = `${street}, ${number}, ${city}, ${state}, Brasil`;
      const results = await Location.geocodeAsync(fullAddress);
      if (!results || results.length === 0) {
        Alert.alert(
          'Endereço não encontrado',
          'Confira rua, número, cidade e estado. O lugar não foi salvo.'
        );
        return;
      }
      const data = {
        name: name.trim(),
        description: description.trim(),
        street: street.trim(),
        number: number.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
        status,
        photo,
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
      if (editing) updatePlace(editing.id, data);
      else addPlace(data);
      navigation.goBack();
    } catch (e) {
      Alert.alert(
        'Erro',
        'Não foi possível converter o endereço em coordenadas. Verifique a conexão e a permissão de localização.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex.: Cristo Redentor" />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Por que quer conhecer / como foi"
      />

      <Text style={styles.label}>Rua</Text>
      <TextInput style={styles.input} value={street} onChangeText={setStreet} />

      <Text style={styles.label}>Número</Text>
      <TextInput style={styles.input} value={number} onChangeText={setNumber} keyboardType="numeric" />

      <Text style={styles.label}>Cidade</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <Text style={styles.label}>Estado (UF)</Text>
      <TextInput
        style={styles.input}
        value={state}
        onChangeText={setState}
        maxLength={2}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.row}>
        {[STATUS.WANT, STATUS.VISITED].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.statusBtn, status === s && styles.statusBtnActive]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.statusText, status === s && { color: '#fff' }]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Foto</Text>
      {photo && <Image source={{ uri: photo }} style={styles.preview} />}
      <View style={styles.row}>
        <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
          <Text style={styles.photoBtnText}>Tirar foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto}>
          <Text style={styles.photoBtnText}>Escolher da galeria</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Salvar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4, color: colors.text },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d5db',
    padding: 10,
    fontSize: 15,
  },
  row: { flexDirection: 'row', gap: 10 },
  statusBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  statusBtnActive: { backgroundColor: colors.primary },
  statusText: { color: colors.primary, fontWeight: '600' },
  preview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  photoBtn: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#e3eefb', alignItems: 'center' },
  photoBtnText: { color: colors.primary, fontWeight: '600' },
  saveBtn: { marginTop: 24, backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
