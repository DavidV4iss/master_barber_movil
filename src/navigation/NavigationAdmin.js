import React, { useEffect, useState } from 'react';
import { Dimensions, ActivityIndicator, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InicioAdminScreen from '../screens/Admin/InicioAdmin';
import GestionarBarberosScreen from '../screens/Admin/GestionarBarberos';
import InventarioScreen from '../screens/Admin/Inventario';
import GestionDeInventarioScreen from '../screens/Admin/GestionDeInventario';
import PerfilAdmin from '../screens/Admin/PerfilAdmin';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '../screens/Admin/CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function NavigationAdmin() {
    const [initialRoute, setInitialRoute] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const getLastRoute = async () => {
            try {
                const lastRoute = await AsyncStorage.getItem('lastRoute');
                setInitialRoute(lastRoute || 'Inicio');
            } catch (error) {
                console.error('Error al recuperar la última ruta:', error);
                setInitialRoute('Inicio');
            } finally {
                setIsReady(true);
            }
        };
        getLastRoute();
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#dc3545" />
            </View>
        );
    }

    const handleStateChange = async (state) => {
        const currentRoute = state.routes[state.index].name;
        await AsyncStorage.setItem('lastRoute', currentRoute);
    };

    return (
        <Drawer.Navigator
            initialRouteName={initialRoute}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#212529',
                    width: 250,
                },
                drawerInactiveTintColor: 'white',
            }}
            screenListeners={{
                state: (e) => handleStateChange(e.data.state),
            }}
        >
            <Drawer.Screen
                name="Inicio"
                component={InicioAdminScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Gestionar Barberos"
                component={GestionarBarberosScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Inventario"
                component={InventarioScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="cube-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Gestion De Inventario"
                component={GestionDeInventarioScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="clipboard-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Perfil"
                component={PerfilAdmin}
                options={{
                    drawerLabel: () => null,
                    drawerItemStyle: { display: 'none' },
                }}
            />
        </Drawer.Navigator>
    );
}
