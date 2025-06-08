import React from 'react';
import HomeScreen from '../screens/default/Home';
import LoginScreen from '../screens/default/Login';
import RegistroScreen from '../screens/default/Registro';
import OlvidoContraseñaScreen from '../screens/default/OlvidoContraseña';
import RestablecerContraseñaScreen from '../screens/default/RestablecerContraseña';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegistrarScreen" component={RegistroScreen} />
        <Stack.Screen name="OlvidoContraseñaScreen" component={OlvidoContraseñaScreen} />
        <Stack.Screen name="RestablecerContrasena" component={RestablecerContraseñaScreen} />
    </Stack.Navigator>
);
export default function DefaultNavigator() {
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
                    } else if (route.name === "Iniciar Sesion") {
                        iconName = focused ? "person-circle" : "person-circle-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "#B0B0B0",
            })}
        >
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name="Iniciar Sesion" component={AuthStack} />
        </Tab.Navigator>
    )
};