import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { PieChart, BarChart } from 'react-native-svg-charts';
import { usePlaces } from '../context/PlacesContext';
import { colors, STATUS } from '../theme/colors';

const CITY_COLORS = ['#1976d2', '#8e24aa', '#00897b', '#f4511e', '#6d4c41', '#3949ab', '#c0ca33'];

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
    return <Text style={styles.empty}>Cadastre lugares para ver os gráficos.</Text>;
  }

  const pieData = statusData
    .filter((s) => s.value > 0)
    .map((s) => ({ key: s.label, value: s.value, svg: { fill: s.color } }));

  const barData = cityData.map((c) => ({ value: c.value, svg: { fill: c.color } }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Lugares por status</Text>
      <PieChart style={{ height: 220 }} data={pieData} innerRadius="35%" />
      <View style={styles.legend}>
        {statusData.map((s) => (
          <View key={s.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.legendText}>
              {s.label}: {s.value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.title, { marginTop: 28 }]}>Lugares por cidade</Text>
      <BarChart
        style={{ height: 200 }}
        data={barData}
        yAccessor={({ item }) => item.value}
        svg={{ fill: colors.primary }}
        contentInset={{ top: 10, bottom: 10 }}
        spacingInner={0.3}
        gridMin={0}
      />
      <View style={styles.legend}>
        {cityData.map((c) => (
          <View key={c.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: c.color }]} />
            <Text style={styles.legendText}>
              {c.label}: {c.value}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: { textAlign: 'center', marginTop: 60, color: colors.muted, fontSize: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: colors.text },
  legend: { marginTop: 12 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 8 },
  legendText: { fontSize: 15, color: colors.text },
});
