import React from 'react';
import HomeScreen from '../screens/default/Home';
import LoginScreen from '../screens/default/Login';
import RegistroScreen from '../screens/default/Registro';
import OlvidoContraseñaScreen from '../screens/default/OlvidoContraseña';
import RestablecerContraseñaScreen from '../screens/default/RestablecerContraseña';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GestionReservas from '../screens/barberos/GestionReservas';
import PerfilBarbero from '../screens/barberos/perfilBarbero';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const UsuarioStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Inicio" component={GestionReservas} />
    <Stack.Screen name="PerfilBarbero" component={PerfilBarbero} />
  </Stack.Navigator>
);
export default function NavigationBarbero() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#2B3035",
          height: 60,
          paddingBottom: 5,
          borderTopColor: "#444",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "Inicio") {
            iconName = focused ? "home-sharp" : "home-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#B0B0B0",
      })}
    >
      <Tab.Screen name="Inicio" component={UsuarioStack} />
    </Tab.Navigator>
  )
};