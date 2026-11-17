import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-svg-charts';
import { usePlaces } from '../context/PlacesContext';
import { colors, STATUS, shadow } from '../theme/colors';

// Tela 5: gráficos calculados a partir dos lugares cadastrados (sem valores fixos)
export default function StatsScreen() {
  const { places } = usePlaces();

  // Quantidade por status
  const statusData = useMemo(
    () =>
      [
        { label: STATUS.WANT, color: colors.wantToVisit },
        { label: STATUS.VISITED, color: colors.visited },
      ].map((s) => ({ ...s, value: places.filter((p) => p.status === s.label).length })),
    [places]
  );

  // Agrupa variações de caixa e espaços, mantendo cidades de estados diferentes separadas.
  const cityData = useMemo(() => {
    const counts = new Map();
    places.forEach((place) => {
      const city = (place.city || '').trim().replace(/\s+/g, ' ');
      const state = (place.state || '').trim().toUpperCase();
      const label = city ? `${city}${state ? ` - ${state}` : ''}` : 'Cidade não informada';
      const key = `${city.toLocaleLowerCase('pt-BR')}|${state}`;
      const entry = counts.get(key);
      if (entry) entry.value += 1;
      else counts.set(key, { label, value: 1 });
    });
    return Array.from(counts.values()).sort(
      (a, b) => b.value - a.value || a.label.localeCompare(b.label, 'pt-BR')
    );
  }, [places]);

  if (places.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <View style={styles.emptyIcon}>
          <Ionicons name="stats-chart" size={40} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Sem dados ainda</Text>
        <Text style={styles.emptyText}>Cadastre lugares para ver os gráficos.</Text>
      </View>
    );
  }

  const pieData = statusData
    .filter((s) => s.value > 0)
    .map((s) => ({ key: s.label, value: s.value, svg: { fill: s.color } }));

  const maxCityCount = cityData[0].value;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>SEU DIÁRIO EM NÚMEROS</Text>
        <Text style={styles.heading}>Suas viagens</Text>
        <Text style={styles.introText}>Um panorama dos lugares que fazem parte da sua história.</Text>
      </View>
      <View style={styles.tiles}>
        <Tile icon="earth" label="Total" value={places.length} color={colors.primary} />
        <Tile icon="checkmark-circle" label="Visitados" value={statusData[1].value} color={colors.visited} />
        <Tile icon="bookmark" label="Desejos" value={statusData[0].value} color={colors.wantToVisit} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}><Ionicons name="pie-chart-outline" size={20} color={colors.primary} /></View>
          <View style={styles.cardHeading}>
            <Text style={styles.title}>Lugares por status</Text>
            <Text style={styles.subtitle}>Seus planos e conquistas</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <PieChart style={styles.chart} data={pieData} innerRadius="68%" outerRadius="96%" />
        </View>
        <Text style={styles.chartCaption}>
          {places.length} {places.length === 1 ? 'lugar cadastrado' : 'lugares cadastrados'}
        </Text>
        <View style={styles.legend}>
          {statusData.map((s) => (
            <View key={s.label} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <Text style={styles.legendText}>{s.label}</Text>
              <View style={styles.legendNumbers}>
                <Text style={styles.legendValue}>{s.value}</Text>
                <Text style={styles.percentage}>{Math.round((s.value / places.length) * 100)}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}><Ionicons name="location-outline" size={20} color={colors.primary} /></View>
          <View style={styles.cardHeading}>
            <Text style={styles.title}>Lugares por cidade</Text>
            <Text style={styles.subtitle}>Onde estão seus destinos</Text>
          </View>
        </View>
        <View style={styles.cityList}>
          {cityData.map((city) => (
            <View key={city.label} style={styles.cityRow}>
              <View style={styles.cityHeading}>
                <Text style={styles.cityLabel}>{city.label}</Text>
                <Text style={styles.legendValue}>{city.value}</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${(city.value / maxCityCount) * 100}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Cartão pequeno de resumo
function Tile({ icon, label, value, color }) {
  return (
    <View style={styles.tile}>
      <View style={[styles.tileIcon, { backgroundColor: `${color}18` }]}><Ionicons name={icon} size={19} color={color} /></View>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  intro: { marginBottom: 20, paddingHorizontal: 2 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.3, color: colors.primary },
  heading: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 5 },
  introText: { fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: 4 },
  tiles: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 2,
    ...shadow,
  },
  tileIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  tileValue: { fontSize: 26, fontWeight: '800', color: colors.text },
  tileLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', textAlign: 'center' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 14, ...shadow },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  cardHeading: { flex: 1 },
  chartContainer: { height: 210, marginTop: 18, justifyContent: 'center' },
  chart: { height: 210 },
  chartCaption: { fontSize: 13, fontWeight: '600', color: colors.muted, textAlign: 'center', marginTop: 8 },
  title: { fontSize: 16, fontWeight: '800', color: colors.primaryDark },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  cityList: { marginTop: 20, gap: 16 },
  cityRow: { gap: 8 },
  cityHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cityLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  barTrack: { height: 10, borderRadius: 5, backgroundColor: colors.primarySoft, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, backgroundColor: colors.primary },
  legend: { marginTop: 16, gap: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  legendNumbers: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  percentage: { minWidth: 44, textAlign: 'right', fontSize: 13, color: colors.muted, fontWeight: '600' },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  legendText: { flex: 1, flexShrink: 1, marginRight: 10, fontSize: 15, color: colors.text },
  legendValue: { fontSize: 15, fontWeight: '800', color: colors.text },
  emptyBox: { flex: 1, backgroundColor: colors.background, alignItems: 'center', paddingTop: 80 },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 16 },
  emptyText: { color: colors.muted, marginTop: 6 },
});
