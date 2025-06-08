import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import useAuth from '../../hooks/useAuth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { useFonts } from 'expo-font';
import PerfilRepository from '../../repositories/PerfilRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseURL } from '../../config/api';
import { showMessage } from 'react-native-flash-message';
import ReservasClientesRepository from '../../repositories/ReservasClientesRepository';

export default function PerfilUsuario() {
    const [fontsLoaded] = useFonts({
        Anton: Anton_400Regular,
        BebasNeue_400Regular,
    });

    const { logout } = useAuth();
    const navigation = useNavigation();

    const [usuario, setUsuario] = useState<any>({});
    const [imagePreviewEditar, setImagePreviewEditar] = useState<string | null>(null);
    const [nuevoNombre, setNuevoNombre] = useState('');

    React.useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;

                const usuario = JSON.parse(atob(token.split('.')[1]));
                const email = usuario.email;

                const res = await ReservasClientesRepository.TraerUsuario(email);
                const user = res.data[0];
                setUsuario(user);
                setNuevoNombre(user.nombre || '');

                if (user.Foto) {
                    setImagePreviewEditar(`${getBaseURL()}perfil/${user.Foto}`);
                }
            } catch (err) {
                console.log("Error al obtener los datos:", err);
            }
        };
        fetchUsuario();
    }, []);



    const handleSeleccionarImagenEditar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const foto = {
                uri: asset.uri,
                type: 'image/jpeg',
                name: `foto_${Date.now()}.jpg`,
            };
            setUsuario(prev => ({ ...prev, foto }));
            setImagePreviewEditar(asset.uri);
        }
    };



    const handleActualizar = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const usuario = JSON.parse(atob(token.split('.')[1]));
            const email = usuario.email;

            const formData = new FormData();
            if (nuevoNombre && nuevoNombre !== usuario.nombre) {
                formData.append('nombre', nuevoNombre);
            }
            if (usuario.foto) {
                formData.append('file', usuario.foto);
            }

            if (!formData.has('nombre') && !formData.has('file')) {
                return Alert.alert('Sin cambios', 'No hiciste ningún cambio para actualizar.');
            }

            await PerfilRepository.actualizarUsuario(email, formData);

            showMessage({
                message: 'PERFIL ACTUALIZADO EXITOSAMENTE',
                description: 'Debes reiniciar la app para ver los cambios.',
                type: 'success',
                duration: 5000
            })
            navigation.reset({
                index: 0,
                routes: [{ name: 'PerfilUsuario' }],
            });
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            Alert.alert('Error', 'Hubo un problema al actualizar el perfil.');
        }
    };

    if (!fontsLoaded) return null;

    const handleLogout = () => {
        logout();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('InicioUsuario')} style={styles.iconBars}>
                    <Ionicons name="arrow-back-circle-outline" size={30} color="#ffffff" style={styles.iconUser} />
                </TouchableOpacity>
            </View>

            <Text style={{ ...styles.title, fontFamily: 'BebasNeue_400Regular', marginTop: 20 }}>¡Perfil!</Text>
            <Text style={{ color: 'gray', marginTop: 10, fontFamily: 'BebasNeue_400Regular', fontSize: 15, marginBottom: 15 }}>Para cambiar tu foto de perfil presiona sobre la imagen</Text>

            <TouchableOpacity onPress={handleSeleccionarImagenEditar} style={styles.imageUploadButton}>
                {imagePreviewEditar ? (
                    <Image
                        source={{ uri: imagePreviewEditar }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={40} color="#aaa" />
                        <Text style={styles.placeholderText}>Seleccionar imagen</Text>
                    </View>
                )}
            </TouchableOpacity>

            <Text style={{ color: '#ffffff', marginTop: 10, fontFamily: 'BebasNeue_400Regular', fontSize: 20 }}>Nombre actual:     {usuario.nombre_usuario}</Text>
            <TextInput
                style={styles.input}
                placeholder="Nuevo Nombre"
                placeholderTextColor="#aaa"
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
            />

            <View style={styles.uploadSection}>
                <TouchableOpacity style={styles.updateButton} onPress={handleActualizar}>
                    <Text style={styles.updateButtonText}>Actualizar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1c',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    iconBars: {
        marginLeft: 20,
    },
    iconUser: {
        marginRight: 10,
        marginTop: 10,
        color: '#ffffff',
        fontSize: 30,
    },
    title: {
        color: '#ffc107',
        fontSize: 43,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    imageUploadButton: {
        marginVertical: 15,
        height: 150,
        width: 150,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    placeholderText: {
        marginTop: 8,
        color: '#aaa',
        fontSize: 14,
    },
    input: {
        backgroundColor: '#2c2c2c',
        color: '#fff',
        width: '80%',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 30,
    },
    uploadSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
    },
    updateButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
    },
    updateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
