import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DefaultLayout from "../../Layouts/DefaultLayout";
import { useNavigation } from '@react-navigation/native';
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { useState } from 'react';
import { useFonts } from "expo-font";
import BarberosRepository from '../../repositories/BarberosRepository';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getBaseURL } from '../../config/api';
import useAuth from '../../hooks/useAuth';



export default function GestionarBarberos() {
    const [fontsLoaded] = useFonts({
        Anton: Anton_400Regular,
        BebasNeue_400Regular,
    });
    const { logout } = useAuth()


    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePreviewEditar, setImagePreviewEditar] = useState(null);
    const [barberos, setBarberos] = useState([]);
    const [barbero, setBarbero] = useState({

        nombre: "",
        email: "",
        contrasena: "",
        descripcion: "",
        foto: null,
    });
    const [barberoEdit, setBarberoEdit] = useState({
        id_usuario: "",
        nombre_usuario: "",
        email: "",
        descripcion: "",
        foto: null,
    });


    const handlesubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('nombre', barbero.nombre);
            formData.append('email', barbero.email);
            formData.append('contrasena', barbero.contrasena);
            formData.append('descripcion', barbero.descripcion);

            if (Platform.OS === 'web') {
                const response = await fetch(barbero.foto.uri);
                const blob = await response.blob();
                formData.append('foto', blob, barbero.foto.name);
            }
            else {
                formData.append('foto', {
                    uri: barbero.foto.uri,
                    type: barbero.foto.type,
                    name: barbero.foto.name,
                })
            }


            const response = await BarberosRepository.CreateBarberos(formData);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Gestionar Barberos' }],
            });
            setModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };
    const handlesubmitEdit = async () => {
        try {
            const formData = new FormData();

            if (barberoEdit.nombre_usuario) {
                formData.append('nombre', barberoEdit.nombre_usuario);
            }
            if (barberoEdit.email) {
                formData.append('email', barberoEdit.email);
            }
            if (barberoEdit.descripcion) {
                formData.append('descripcion', barberoEdit.descripcion);
            }

            if (barberoEdit.foto) {
                if (Platform.OS === 'web' && barberoEdit.foto.uri) {
                    const response = await fetch(barberoEdit.foto.uri);
                    const blob = await response.blob();
                    formData.append('foto', blob, barberoEdit.foto.name);
                } else {
                    formData.append('foto', {
                        uri: barberoEdit.foto.uri,
                        type: barberoEdit.foto.type,
                        name: barberoEdit.foto.name,
                    });
                }
            }

            const response = await BarberosRepository.UpdateBarberos(barberoEdit.id_usuario, formData);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Gestionar Barberos' }],
            });

            setModalVisibleEdit(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSeleccionarImagen = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            if (Platform.OS === 'web') {
                setBarbero({ ...barbero, foto: asset });
            }
            const foto = {
                uri: asset.uri,
                type: 'image/jpeg',
                name: `foto_${Date.now()}.jpg`,
            }
            setBarbero({ ...barbero, foto });
            setImagePreview(asset.uri);
        }
    };

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
            setBarberoEdit({ ...barberoEdit, foto });
            setImagePreviewEditar(asset.uri);
        }
    };

    const handleChange = (data) => (value) => {
        setBarbero({ ...barbero, [data]: value });
    };

    const handleChangeEdit = (data) => (value) => {
        setBarberoEdit({ ...barberoEdit, [data]: value });
    };

    const fetchBarberos = async () => {
        try {
            const response = await BarberosRepository.GetBarberos();
            setBarberos(response.data);
        } catch (err) {
            console.log("Error al obtener los datos:", err);
        }
    };

    React.useEffect(() => {
        fetchBarberos();
    }, []);

    if (!fontsLoaded) return null;


    const DeleteBarberos = async (id) => {
        try {
            const response = await BarberosRepository.DeleteBarberos(id);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Gestionar Barberos' }],
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        logout();
    }






    return (
        <DefaultLayout>
            <View style={{ flex: 1, backgroundColor: '#212529', padding: 20 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Icon name="bars" size={Dimensions.get('window').width * 0.08} color="#ffffff" style={styles.iconBars} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <Icon name="sign-out" size={Dimensions.get('window').width * 0.08} color="#ffffff" style={styles.iconUser} />
                    </TouchableOpacity >
                </View>
                <ScrollView>
                    <Text style={[styles.responsiveText, { marginBottom: 20, marginTop: Dimensions.get('window').height * 0.09 }]}>
                        HOLA, <Text style={{ color: '#dc3545' }}>ADMINISTRADOR</Text> | AQUÍ PODRÁS EDITAR, AÑADIR Y ELIMINAR BARBEROS
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#dc3545',
                            padding: 10,
                            borderRadius: 5,
                            alignSelf: 'flex-end',
                            marginBottom: 20,
                        }}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Añadir</Text>
                    </TouchableOpacity>

                    <View>
                        {barberos.map((barbero, index) => (
                            <View style={styles.card} key={index}>
                                <View style={styles.cardContent}>
                                    <Image source={{ uri: `${getBaseURL()}imagesBarbero/${barbero.Foto}` }} style={{ ...styles.cardImage, marginBottom: 15 }} />
                                    <Text style={{ ...styles.cardTitle, color: '#dc3545', fontFamily: 'Anton_400Regular', fontSize: 20, textAlign: 'center' }}>{barbero.nombre_usuario}</Text>
                                    <Text style={styles.cardText}>{barbero.email}</Text>
                                    <Text style={styles.cardText}>{barbero.descripcion}</Text>
                                    <View style={styles.cardActions}>
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={() => {
                                                setBarberoEdit(barbero);
                                                setImagePreviewEditar(`${getBaseURL()}imagesBarbero/${barbero.Foto}`);
                                                setModalVisibleEdit(true);
                                            }}
                                        >
                                            <Icon name="pencil" size={16} color="#000000" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => DeleteBarberos(barbero.id_usuario)}
                                        >
                                            <Icon name="trash" size={16} color="#ffffff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            {/* ModalAñadir */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir Nuevo Barbero</Text>
                        <ScrollView >
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre Del Barbero"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("nombre")}
                                value={barbero.nombre}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("email")}
                                value={barbero.email}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("contrasena")}
                                value={barbero.contrasena}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Descripción"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("descripcion")}
                                value={barbero.descripcion}
                            />
                            <TouchableOpacity
                                onPress={handleSeleccionarImagen}
                                style={styles.imageUploadButton}
                            >
                                {imagePreview ? (
                                    <Image
                                        source={{ uri: imagePreview }}
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


                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={{ color: '#ffffff' }}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                >
                                    <Text style={{ color: '#ffffff' }} onPress={handlesubmit}>Guardar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            {/* FIN MODAL AÑADIR */}


            {/* MODAL EDITAR */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleEdit}
                onRequestClose={() => setModalVisibleEdit(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Barbero</Text>
                        <ScrollView style={{ width: '100%' }}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre Del Barbero"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChangeEdit("nombre_usuario")}
                                value={barberoEdit.nombre_usuario}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChangeEdit("email")}
                                value={barberoEdit.email}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Descripción"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChangeEdit("descripcion")}
                                value={barberoEdit.descripcion}

                            />
                            <TouchableOpacity
                                onPress={handleSeleccionarImagenEditar}
                                style={styles.imageUploadButton}
                            >
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

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisibleEdit(false)}
                                >
                                    <Text style={{ color: '#ffffff' }}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handlesubmitEdit}
                                >
                                    <Text style={{ color: '#ffffff' }}>Guardar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            {/* FIN MODAL EDITAR */}

        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    iconBars: {
        marginLeft: Dimensions.get('window').width * 0.07,
        marginTop: Dimensions.get('window').height * 0.02,
    },

    iconUser: {
        marginRight: Dimensions.get('window').width * 0.07,
        marginTop: Dimensions.get('window').height * 0.02,
    },
    responsiveText: {
        color: '#ffffff',
        fontSize: Dimensions.get('window').width * 0.05,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#343a40',
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },

    cardImage: {
        width: '100%',
        height: 270,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardText: {
        color: '#ffffff',
        fontSize: 14,
        marginBottom: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    editButton: {
        backgroundColor: '#ffc107',
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#343a40',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#212529',
        color: '#ffffff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    imageUploadButton: {
        marginVertical: 15,
        height: 150,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
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
    dropdownMenu: {
        position: 'absolute',
        right: Dimensions.get('window').width * 0.2,
        backgroundColor: '#343a40',
        padding: 10,
        borderRadius: 5,
    },
    dropdownItem: {
        color: '#ffffff',
        fontSize: Dimensions.get('window').width * 0.04,
        paddingVertical: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Dimensions.get('window').width * 0.00,
        paddingTop: 20,
        backgroundColor: '#212529',
        marginBottom: 15,
    },
})

