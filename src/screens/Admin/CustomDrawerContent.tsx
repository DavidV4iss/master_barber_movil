import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PerfilRepository from '../../repositories/PerfilRepository';
import { getBaseURL } from '../../config/api';

export default function CustomDrawerContent(props) {
    const [admin, setAdmin] = useState({});
    const [imagePreviewEditar, setImagePreviewEditar] = useState(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;

                const usuario = JSON.parse(atob(token.split('.')[1]));
                const email = usuario.email;

                const res = await PerfilRepository.TraerUsuario(email);
                const user = res.data[0];
                setAdmin(user);

                if (user.Foto) {
                    setImagePreviewEditar(`${getBaseURL()}perfil/${user.Foto}`);
                }
            } catch (err) {
                console.log("Error al obtener los datos:", err);
            }
        };

        fetchAdmin();
    }, []);

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DrawerItemList {...props} />

                <View style={{ flex: 1 }} />

                <DrawerItem
                    label={admin.nombre_usuario || ''}
                    icon={() => (
                        imagePreviewEditar ? (
                            <Image
                                source={{ uri: imagePreviewEditar }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <Ionicons name="person-circle" size={35} color="#fff" />
                        )
                    )}
                    onPress={() => props.navigation.navigate('Perfil')}
                    labelStyle={{ color: 'gray', fontSize: 20, fontFamily: 'BebasNeue_400Regular' }}
                />
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 17.5,
        marginRight: 25,
    },
});