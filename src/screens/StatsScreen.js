import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-svg-charts';
import { usePlaces } from '../context/PlacesContext';
import { colors, STATUS, shadow } from '../theme/colors';

const CITY_COLORS = ['#0E7C86', '#7C3AED', '#F97316', '#DB2777', '#2563EB', '#65A30D', '#B45309'];

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

  // Quantidade por cidade
  const cityData = useMemo(() => {
    const counts = {};
    places.forEach((p) => {
      counts[p.city] = (counts[p.city] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value], i) => ({
      label,
      value,
      color: CITY_COLORS[i % CITY_COLORS.length],
    }));
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

  const barData = cityData.map((c) => ({ value: c.value, svg: { fill: c.color } }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
      {/* Resumo */}
      <View style={styles.tiles}>
        <Tile icon="earth" label="Total" value={places.length} color={colors.primary} />
        <Tile icon="checkmark-circle" label="Visitados" value={statusData[1].value} color={colors.visited} />
        <Tile icon="bookmark" label="Desejos" value={statusData[0].value} color={colors.wantToVisit} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Lugares por status</Text>
        <PieChart style={{ height: 210, marginTop: 8 }} data={pieData} innerRadius="40%" />
        <View style={styles.legend}>
          {statusData.map((s) => (
            <View key={s.label} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <Text style={styles.legendText}>{s.label}</Text>
              <Text style={styles.legendValue}>{s.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Lugares por cidade</Text>
        <BarChart
          style={{ height: 190, marginTop: 8 }}
          data={barData}
          yAccessor={({ item }) => item.value}
          svg={{ fill: colors.primary }}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.35}
          gridMin={0}
        />
        <View style={styles.legend}>
          {cityData.map((c) => (
            <View key={c.label} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: c.color }]} />
              <Text style={styles.legendText}>{c.label}</Text>
              <Text style={styles.legendValue}>{c.value}</Text>
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
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tiles: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 2,
    ...shadow,
  },
  tileValue: { fontSize: 26, fontWeight: '800', color: colors.text },
  tileLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 14, ...shadow },
  title: { fontSize: 16, fontWeight: '800', color: colors.primaryDark },
  legend: { marginTop: 12, gap: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  legendText: { flex: 1, fontSize: 15, color: colors.text },
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
