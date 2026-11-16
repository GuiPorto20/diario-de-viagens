import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlacesProvider } from './src/context/PlacesContext';
import PlacesListScreen from './src/screens/PlacesListScreen';
import AddPlaceScreen from './src/screens/AddPlaceScreen';
import PlaceDetailsScreen from './src/screens/PlaceDetailsScreen';
import MapScreen from './src/screens/MapScreen';
import StatsScreen from './src/screens/StatsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Abas: Lista, Mapa e Estatísticas
function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Lista" component={PlacesListScreen} options={{ title: 'Meus Lugares' }} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Estatisticas" component={StatsScreen} options={{ title: 'Estatísticas' }} />
    </Tab.Navigator>
  );
}

// Pilha: abas + Cadastro + Detalhes
export default function App() {
  return (
    <PlacesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Inicio" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={AddPlaceScreen} options={{ title: 'Cadastro de Lugar' }} />
          <Stack.Screen name="Detalhes" component={PlaceDetailsScreen} options={{ title: 'Detalhes do Lugar' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PlacesProvider>
  );
}
