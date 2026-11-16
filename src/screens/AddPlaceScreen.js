import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Field from '../components/Field';
import { usePlaces } from '../context/PlacesContext';
import { colors, STATUS, statusColor, statusIcon, shadow } from '../theme/colors';

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
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Foto */}
      <View style={styles.card}>
        <Text style={styles.section}>Foto</Text>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.preview} />
        ) : (
          <View style={[styles.preview, styles.noPhoto]}>
            <Ionicons name="image-outline" size={40} color={colors.primary} />
            <Text style={styles.noPhotoText}>Nenhuma foto selecionada</Text>
          </View>
        )}
        <View style={styles.row}>
          <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
            <Ionicons name="camera" size={18} color={colors.primary} />
            <Text style={styles.photoBtnText}>Tirar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto}>
            <Ionicons name="images" size={18} color={colors.primary} />
            <Text style={styles.photoBtnText}>Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dados do lugar */}
      <View style={styles.card}>
        <Text style={styles.section}>Sobre o lugar</Text>
        <Field label="Nome" icon="flag-outline" value={name} onChangeText={setName} placeholder="Ex.: Cristo Redentor" />
        <Field
          label="Descrição"
          icon="create-outline"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Por que quer conhecer / como foi"
        />

        <Text style={[styles.label, { marginTop: 14 }]}>Status</Text>
        <View style={styles.row}>
          {[STATUS.WANT, STATUS.VISITED].map((s) => {
            const active = status === s;
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusBtn,
                  { borderColor: statusColor(s) },
                  active && { backgroundColor: statusColor(s) },
                ]}
                onPress={() => setStatus(s)}
              >
                <Ionicons name={statusIcon(s)} size={16} color={active ? '#fff' : statusColor(s)} />
                <Text style={[styles.statusText, { color: active ? '#fff' : statusColor(s) }]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Endereço */}
      <View style={styles.card}>
        <Text style={styles.section}>Endereço</Text>
        <Field label="Rua" icon="trail-sign-outline" value={street} onChangeText={setStreet} />
        <View style={styles.row}>
          <Field style={{ flex: 1 }} label="Número" icon="keypad-outline" value={number} onChangeText={setNumber} keyboardType="numeric" />
          <Field
            style={{ flex: 1 }}
            label="UF"
            icon="map-outline"
            value={state}
            onChangeText={setState}
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>
        <Field label="Cidade" icon="business-outline" value={city} onChangeText={setCity} />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving} activeOpacity={0.85}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text style={styles.saveText}>{editing ? 'Salvar alterações' : 'Salvar lugar'}</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 14, ...shadow },
  section: { fontSize: 16, fontWeight: '800', color: colors.primaryDark },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 5 },
  row: { flexDirection: 'row', gap: 10 },
  preview: { width: '100%', height: 190, borderRadius: 12, marginVertical: 12 },
  noPhoto: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', gap: 6 },
  noPhotoText: { color: colors.muted, fontSize: 13 },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  photoBtnText: { color: colors.primary, fontWeight: '700' },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 11,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  statusText: { fontWeight: '700', fontSize: 13 },
  saveBtn: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14,
    ...shadow,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
