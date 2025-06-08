import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Modal, TextInput, Platform, Button } from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DefaultLayout from "../../Layouts/DefaultLayout";
import { useNavigation } from '@react-navigation/native';
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { useState } from 'react';
import { useFonts } from "expo-font";
import InventarioRepository from '../../repositories/InventarioRepository';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getBaseURL } from '../../config/api';
import useAuth from '../../hooks/useAuth';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function Inventario() {
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
    const [inventario, setInventario] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [editDate, setEditDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showEditDatePicker, setShowEditDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showEditTimePicker, setShowEditTimePicker] = useState(false);
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion_P: '',
        cantidad: '',
        id_categoria_producto: '',
        proveedor: '',
        fecha_venta: '',
        foto: null,
        PrecioUnitario: ''
    });
    const [productoEditar, setProductoEditar] = useState({
        id_producto: '',
        nombre: '',
        descripcion_P: '',
        cantidad: '',
        id_categoria_producto: '',
        proveedor: '',
        fecha_venta: '',
        foto: null,
        PrecioUnitario: ''
    });

    const [categorias, setCategorias] = useState([]);




    const handlesubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('nombre', producto.nombre);
            formData.append('descripcion_P', producto.descripcion_P);
            formData.append('cantidad', producto.cantidad);
            formData.append('id_categoria_producto', producto.id_categoria_producto);
            formData.append('proveedor', producto.proveedor);
            const fechaLocal = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            formData.append('fecha_venta', fechaLocal);
            formData.append('PrecioUnitario', producto.PrecioUnitario);

            if (Platform.OS === 'web') {
                const response = await fetch(producto.foto.uri);
                const blob = await response.blob();
                formData.append('foto', blob, producto.foto.name);
            }
            else {
                formData.append('foto', {
                    uri: producto.foto.uri,
                    type: producto.foto.type,
                    name: producto.foto.name,
                })
            }

            const response = await InventarioRepository.CreateInventario(formData);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Inventario' }],
            });
            setModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };
    const handlesubmitEdit = async () => {
        try {
            const formData = new FormData();

            if (productoEditar.nombre) {
                formData.append('nombre', productoEditar.nombre);
            }
            if (productoEditar.descripcion_P) {
                formData.append('descripcion_P', productoEditar.descripcion_P);
            }
            if (productoEditar.cantidad) {
                formData.append('cantidad', productoEditar.cantidad);
            }
            if (productoEditar.id_categoria_producto) {
                formData.append('id_categoria_producto', productoEditar.id_categoria_producto);
            }
            if (productoEditar.proveedor) {
                formData.append('proveedor', productoEditar.proveedor);
            }
            if (productoEditar.PrecioUnitario) {
                formData.append('PrecioUnitario', productoEditar.PrecioUnitario);
            }

            if (editDate) {
                const fechaLocal = `${editDate.getFullYear()}-${(editDate.getMonth() + 1).toString().padStart(2, '0')}-${editDate.getDate().toString().padStart(2, '0')} ${editDate.getHours().toString().padStart(2, '0')}:${editDate.getMinutes().toString().padStart(2, '0')}`;
                formData.append('fecha_venta', fechaLocal);
            }

            if (productoEditar.foto) {
                if (Platform.OS === 'web' && productoEditar.foto.uri) {
                    const response = await fetch(productoEditar.foto.uri);
                    const blob = await response.blob();
                    formData.append('foto', blob, productoEditar.foto.name);
                } else {
                    formData.append('foto', {
                        uri: productoEditar.foto.uri,
                        type: productoEditar.foto.type,
                        name: productoEditar.foto.name,
                    });
                }
            }

            const response = await InventarioRepository.UpdateInventario(productoEditar.id_producto, formData);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Inventario' }],
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
                setProducto({ ...producto, foto: asset });
            }
            const foto = {
                uri: asset.uri,
                type: 'image/jpeg',
                name: `foto_${Date.now()}.jpg`,
            }
            setProducto({ ...producto, foto });
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
            setProductoEditar({ ...productoEditar, foto });
            setImagePreviewEditar(asset.uri);
        }
    };

    const handleChange = (data) => (value) => {
        setProducto({ ...producto, [data]: value });
    };

    const handleChangeEdit = (data) => (value) => {
        setProductoEditar({ ...productoEditar, [data]: value });
    };


    const onDateChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowDatePicker(false);
            return;
        }

        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(prev => new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                prev.getHours(),
                prev.getMinutes()
            ));
        }
    };

    const onTimeChange = (event, selectedTime) => {
        if (event.type === 'dismissed') {
            setShowTimePicker(false);
            return;
        }

        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setDate(prev => new Date(
                prev.getFullYear(),
                prev.getMonth(),
                prev.getDate(),
                selectedTime.getHours(),
                selectedTime.getMinutes()
            ));
        }
    };



    const onEditDateChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowEditDatePicker(false);
            return;
        }

        setShowEditDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEditDate(prev => new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                prev.getHours(),
                prev.getMinutes()
            ));
        }
    };

    const onEditTimeChange = (event, selectedTime) => {
        if (event.type === 'dismissed') {
            setShowEditTimePicker(false);
            return;
        }

        setShowEditTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setEditDate(prev => new Date(
                prev.getFullYear(),
                prev.getMonth(),
                prev.getDate(),
                selectedTime.getHours(),
                selectedTime.getMinutes()
            ));
        }
    };

    const fetchInventario = async () => {
        try {
            const response = await InventarioRepository.GetInventario();
            setInventario(response.data);
        } catch (err) {
            console.log("Error al obtener los datos:", err);
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [inventarioRes, categoriasRes] = await Promise.all([
                    InventarioRepository.GetInventario(),
                    InventarioRepository.categorias(),
                ]);
                setInventario(inventarioRes.data);
                setCategorias(categoriasRes.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        fetchInventario();
    }, []);


    if (!fontsLoaded) return null;


    const DeleteInventario = async (id) => {
        try {
            const response = await InventarioRepository.DeleteInventario(id);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Inventario' }],
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
                    {inventario.map((inventario, id_producto) => (
                        <View style={styles.card} key={id_producto}>
                            <View style={styles.cardContent}>
                                <Image source={{ uri: `${getBaseURL()}ImagesInventario/${inventario.Foto}` }} style={{ ...styles.cardImage, marginBottom: 15, }} />
                                <Text style={{ ...styles.cardTitle, color: '#dc3545', fontFamily: 'Anton_400Regular', fontSize: 20, textAlign: 'center' }}>{inventario.nombre}</Text>
                                <Text style={styles.cardText}><Text style={{ fontWeight: 'bold', color: '#dc3545' }}>ID: </Text> {"   "} {inventario.id_producto}</Text>
                                <Text style={styles.cardText}><Text style={{ fontWeight: 'bold', color: '#dc3545' }}>Descripcion: </Text>  {"   "}{inventario.descripcion_P}</Text>
                                <Text style={styles.cardText}><Text style={{ fontWeight: 'bold', color: '#dc3545' }}>Cantidad: </Text>{"   "}  {inventario.cantidad}</Text>
                                <Text style={styles.cardText}><Text style={{ fontWeight: 'bold', color: '#dc3545' }}>Categoria: </Text>{"   "}{categorias.find((categoria) => categoria.id_categoria_producto === inventario.id_categoria_producto)?.categoria}</Text>
                                <Text style={styles.cardText}><Text style={{ fontWeight: 'bold', color: '#dc3545' }}>Proveedor: </Text>{"   "}{inventario.proveedor}</Text>
                                <Text style={styles.cardText}><Text style={{ fontWeight: 'bold', color: '#dc3545' }}>Fecha Y Hora: </Text>{"   "}{inventario.fecha_venta}</Text>
                                <Text style={{ ...styles.cardText, marginBottom: 30 }}><Text style={{ fontWeight: 'bold', color: '#dc3545' }}>Precio: </Text>{"   "}{inventario.PrecioUnitario}</Text>

                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => {
                                            setProductoEditar(inventario);

                                            const fecha = new Date(inventario.fecha_venta);
                                            if (!isNaN(fecha.getTime())) {
                                                setEditDate(fecha);
                                            } else {
                                                setEditDate(new Date());
                                            }

                                            setImagePreviewEditar(`${getBaseURL()}ImagesInventario/${inventario.Foto}`);
                                            setModalVisibleEdit(true);
                                        }}
                                    >


                                        <Icon name="pencil" size={16} color="#000000" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => DeleteInventario(inventario.id_producto)}
                                    >
                                        <Icon name="trash" size={16} color="#ffffff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
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
                        <Text style={styles.modalTitle}>Añadir Nuevo Producto</Text>
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre Del Producto"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("nombre")}
                                value={producto.nombre}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Descripcion"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("descripcion_P")}
                                value={producto.descripcion_P}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Cantidad"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("cantidad")}
                                value={producto.cantidad}
                            />
                            <Picker
                                selectedValue={selectedValue}
                                onValueChange={(itemValue) => {
                                    setSelectedValue(itemValue);
                                    setProducto({ ...producto, id_categoria_producto: itemValue });
                                }}
                                style={styles.input}
                            >
                                <Picker.Item label="Selecciona una categoria" value="" style={{ color: '#fff' }} />
                                {categorias.map((categoria) => (
                                    <Picker.Item key={categoria.id_categoria_producto} label={categoria.categoria} value={categoria.id_categoria_producto} />
                                ))}
                            </Picker>
                            <TextInput
                                style={styles.input}
                                placeholder="Proveedor"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("proveedor")}
                                value={producto.proveedor}
                            />
                            <View>
                                <View style={{ marginTop: 10, borderRadius: 8, marginBottom: 15, width: '100%', }} >
                                    <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
                                </View>
                                <View style={{ marginTop: 10, borderRadius: 5, marginBottom: 15, width: '100%', }}>
                                    <Button title="Seleccionar Hora" onPress={() => setShowTimePicker(true)} />
                                </View>


                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                    />
                                )}

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="time"
                                        display="default"
                                        onChange={onTimeChange}
                                        is24Hour={true}
                                    />
                                )}
                                <Text style={{ color: '#fff', fontFamily: 'BebasNeue_400Regular', fontSize: 18, alignSelf: 'center', marginBottom: 20 }}>Fecha y hora seleccionada:{"        "}{date.toLocaleString()}</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Precio Unitario"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChange("PrecioUnitario")}
                                value={producto.PrecioUnitario}
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

                            <View style={{ ...styles.modalActions, marginBottom: 20 }}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={{ color: '#ffffff' }}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handlesubmit}
                                >
                                    <Text style={{ color: '#ffffff' }}>Guardar</Text>
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
                        <Text style={styles.modalTitle}>Editar Producto</Text>
                        <ScrollView style={{ width: '100%' }}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre Del Producto"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChangeEdit("nombre")}
                                value={productoEditar.nombre}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Descripcion"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChangeEdit("descripcion_P")}
                                value={productoEditar.descripcion_P}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Cantidad"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChangeEdit("cantidad")}
                                value={productoEditar.cantidad}
                            />
                            <Picker
                                selectedValue={productoEditar.id_categoria_producto}
                                onValueChange={(itemValue) => setProductoEditar({ ...productoEditar, id_categoria_producto: itemValue })}
                                style={styles.input}
                            >
                                <Picker.Item label="Selecciona una categoria" value="" style={{ color: '#fff' }} />
                                {categorias.map((categoria) => (
                                    <Picker.Item key={categoria.id_categoria_producto} label={categoria.categoria} value={categoria.id_categoria_producto} />
                                ))}
                            </Picker>
                            <TextInput
                                style={styles.input}
                                placeholder="Proveedor"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChangeEdit("proveedor")}
                                value={productoEditar.proveedor}
                            />
                            <View style={{ marginTop: 10, borderRadius: 8, marginBottom: 15 }}>
                                <Button title="Seleccionar Fecha" onPress={() => setShowEditDatePicker(true)} />
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Button title="Seleccionar Hora" onPress={() => setShowEditTimePicker(true)} />
                            </View>

                            {showEditDatePicker && (
                                <DateTimePicker
                                    value={editDate}
                                    mode="date"
                                    display="default"
                                    onChange={onEditDateChange}
                                />
                            )}

                            {showEditTimePicker && (
                                <DateTimePicker
                                    value={editDate}
                                    mode="time"
                                    display="default"
                                    onChange={onEditTimeChange}
                                    is24Hour={true}
                                />
                            )}

                            <Text style={{ color: '#fff', fontFamily: 'BebasNeue_400Regular', fontSize: 18, alignSelf: 'center', marginBottom: 20 }}>
                                Fecha y hora seleccionada: {editDate.toLocaleString()}
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Precio Unitario"
                                placeholderTextColor="#ccc"
                                onChangeText={handleChangeEdit("PrecioUnitario")}
                                value={productoEditar.PrecioUnitario}
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

                            <View style={{ ...styles.modalActions, marginBottom: 20 }}>
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
        </DefaultLayout >
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
        flex: 1,
        width: '90%',
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

