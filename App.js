import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlacesProvider } from './src/context/PlacesContext';
import PlacesListScreen from './src/screens/PlacesListScreen';
import AddPlaceScreen from './src/screens/AddPlaceScreen';
import PlaceDetailsScreen from './src/screens/PlaceDetailsScreen';
import MapScreen from './src/screens/MapScreen';
import StatsScreen from './src/screens/StatsScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.primary },
};

// Cabeçalho colorido, igual em todas as telas
const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: false,
};

const tabIcons = { Lista: 'list', Mapa: 'map', Estatisticas: 'stats-chart' };

// Abas: Lista, Mapa e Estatísticas
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOptions,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? tabIcons[route.name] : `${tabIcons[route.name]}-outline`}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Lista" component={PlacesListScreen} options={{ title: 'Meus Lugares', tabBarLabel: 'Lugares' }} />
      <Tab.Screen name="Mapa" component={MapScreen} options={{ title: 'Mapa' }} />
      <Tab.Screen name="Estatisticas" component={StatsScreen} options={{ title: 'Estatísticas', tabBarLabel: 'Estatísticas' }} />
    </Tab.Navigator>
  );
}

// Pilha: abas + Cadastro + Detalhes
export default function App() {
  return (
    <PlacesProvider>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={headerOptions}>
          <Stack.Screen name="Inicio" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={AddPlaceScreen} options={{ title: 'Cadastro de Lugar' }} />
          <Stack.Screen name="Detalhes" component={PlaceDetailsScreen} options={{ title: 'Detalhes do Lugar' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </PlacesProvider>
  );
}
