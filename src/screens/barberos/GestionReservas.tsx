import { Anton_400Regular } from '@expo-google-fonts/anton';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DefaultLayout from '../../Layouts/DefaultLayout';
import useAuth from '../../hooks/useAuth';
import ReservasClientesRepository from '../../repositories/ReservasClientesRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer'; // necesario para decodificar Base64
import { getBaseURL } from '../../config/api';
import { useNavigation } from '@react-navigation/native';


const GestionReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingFinal, setIsLoadingFinal] = useState(false);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);
    const [isLoadingAccept, setIsLoadingAccept] = useState(false);
    const [finalizedReservations, setFinalizedReservations] = useState([]);
    const [barberoId, setBarberoId] = useState("");
    const [cancelTimers, setCancelTimers] = useState({});
    const [Barber, setBarber] = useState({});
    const navigation = useNavigation();


    const fetchReservas = async (id) => {
        try {
            const response = await ReservasClientesRepository.GetBarberosDisponibles(id);
            setReservas(response.data);
        } catch (err) {
            console.log("Error al obtener las reservas del barbero:", err);
        }
    };

    const fetchTraerUsuarios = async (email) => {
        try {
            const response = await ReservasClientesRepository.TraerUsuario(email);
            setBarber(response.data[0]);
        } catch (err) {
            console.log("Error al obtener los datos del barbero:", err);
        }
    };


    const fetchServicios = async () => {
        try {
            const response = await ReservasClientesRepository.GetServicios();
            setServicios(response.data);
        } catch (err) {
            console.log("Error al obtener los servicios:", err);
        }
    }

    const fetchGetClientes = async () => {
        try {
            const response = await ReservasClientesRepository.GetClientes();
            setClientes(response.data);
        } catch (err) {
            console.log("Error al obtener los clientes:", err);
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const payload = token.split(".")[1];
                    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
                    setBarberoId(decoded.id);
                    fetchTraerUsuarios(decoded.email); // o guarda el email en estado si lo necesitas
                    fetchReservas(decoded.id);
                }
                fetchServicios();
                fetchGetClientes();
            } catch (err) {
                console.error("Error al procesar el token:", err);
            }
        };
        init();
    }, []);


    const handleAccept = (id) => {
        setIsLoadingAccept(true);
        const response = ReservasClientesRepository.UpdateReservasEstado(id, 'Aceptada');
        response
            .then(response => {
                console.log(response.data);
                setReservas(reservas.map(reserva => reserva.id_reserva === id ? { ...reserva, estado: 'Aceptada' } : reserva));
                // Limpiar temporizador si existe
                if (cancelTimers[id]) {
                    clearTimeout(cancelTimers[id]);
                    setCancelTimers(prev => {
                        const updatedTimers = { ...prev };
                        delete updatedTimers[id];
                        return updatedTimers;
                    });
                }
            })
            .catch(error => {
                console.error('Hubo un error al aceptar la reserva:', error);
            })
            .finally(() => {
                setIsLoadingAccept(false);
            });
    };

    const handleCancel = (id) => {
        setIsLoadingCancel(true);
        const response = ReservasClientesRepository.UpdateReservasEstado(id, 'Cancelada');
        response
            .then(response => {
                console.log(response.data);
                setReservas(reservas.map(reserva => reserva.id_reserva === id ? { ...reserva, estado: 'Cancelada' } : reserva));
                // Iniciar temporizador de 1 hora
                const timer = setTimeout(() => {
                    handleDelete(id);
                }, 60 * 60 * 1000);
                setCancelTimers(prev => ({ ...prev, [id]: timer }));
            })
            .catch(error => {
                console.error('Hubo un error al cancelar la reserva:', error);
            })
            .finally(() => {
                setIsLoadingCancel(false);
            });
    };

    const handleFinalize = (id) => {
        setIsLoadingFinal(true);
        const response = ReservasClientesRepository.UpdateReservasEstado(id, 'finalizada');
        response
            .then(response => {
                console.log(response.data);
                setReservas(reservas.map(reserva => reserva.id_reserva === id ? { ...reserva, estado: 'finalizada' } : reserva));
                setFinalizedReservations([...finalizedReservations, id]);
            })
            .catch(error => {
                console.error('Hubo un error al finalizar la reserva:', error);
            })
            .finally(() => {
                setIsLoadingFinal(false);
            });
    };

    const handleDelete = (id) => {
        const response = ReservasClientesRepository.DeleteReservas(id);
        response
            .then(response => {
                console.log(response.data);
                setReservas(reservas.filter(reserva => reserva.id_reserva !== id));
                // Limpiar temporizador si existe
                if (cancelTimers[id]) {
                    clearTimeout(cancelTimers[id]);
                    setCancelTimers(prev => {
                        const updatedTimers = { ...prev };
                        delete updatedTimers[id];
                        return updatedTimers;
                    });
                }
            })
            .catch(error => {
                console.error('Hubo un error al eliminar la reserva:', error);
            });
    };


    const getServiceName = (id) => {
        const servicio = servicios.find(servicio => servicio.id_tipo_servicio === id);
        return servicio ? servicio.nombre : 'Desconocido';
    }


    const getClientName = (id) => {
        const cliente = clientes.find(cliente => cliente.id_usuario === id);
        return [{
            nombre: cliente ? cliente.nombre_usuario : 'Desconocido',
        }];
    }
    const getImage = (id) => {
        const cliente = clientes.find(cliente => cliente.id_usuario === id);
        return cliente && cliente.Foto
            ? `${getBaseURL()}perfil/${cliente.Foto}`
            : null;
    };

    const [fontsLoaded] = useFonts({
        Anton: Anton_400Regular,
        BebasNeue: BebasNeue_400Regular,
    });
    const { logout } = useAuth()
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const handleLogout = () => {
        logout();
    }
    if (!fontsLoaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={{ color: '#ffffff', marginTop: 10 }}>Cargando fuentes...</Text>
            </View>
        );
    }

    return (
        <DefaultLayout>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.welcome}>
                        <Text style={styles.MB}>Master Barber</Text>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
                                    <Image
                                        source={{
                                                            uri: `${getBaseURL()}imagesBarbero/${Barber ? Barber.Foto : "default.jpg"}`,
                                                          }}
                                        style={{ marginTop: 10, width: 45, height: 45, borderRadius: 25 }}
                                    />
                                </TouchableOpacity >
                                {isDropdownVisible && (
                                    <View style={styles.dropdownMenu} >
                                        <TouchableOpacity onPress={() => navigation.navigate("PerfilBarbero")}>
                                                            <Text
                                                              style={{
                                                                ...styles.dropdownItem,
                                                                marginBottom: 5,
                                                                fontFamily: "BebasNeue_400Regular",
                                                                color: "#ffc107",
                                                              }}
                                                            >
                                                              Perfil
                                                            </Text>
                                                          </TouchableOpacity>
                                        <TouchableOpacity onPress={handleLogout}>
                                            <Text style={{ ...styles.dropdownItem, padding: 10, backgroundColor: '#dc3545', fontFamily: 'BebasNeue_400Regular' }}>Cerrar Sesión</Text>
                                        </TouchableOpacity>

                                    </View>
                                )}
                            </View>
                            <Text style={{ color: '#ffffff', fontFamily: 'BebasNeue', fontSize: 14 }}>
                                {Barber.nombre_usuario}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.welcomeText}>
                        BIENVENIDO BARBERO
                        <Text style={styles.welcomeName}>{Barber.nombre_usuario}</Text>

                    </Text>
                    {isLoadingFinal && <ActivityIndicator size="small" color="#ffffff" style={styles.loading} />}
                    {isLoadingCancel && <ActivityIndicator size="small" color="#ffffff" style={styles.loading} />}
                    {isLoadingAccept && <ActivityIndicator size="small" color="#ffffff" style={styles.loading} />}

                    <Text style={styles.textInfo}>
                        Desde este apartado, podras revisar todos los turnos agendados, aceptarlos, cancelarlos o finalizarlos según sea necesario. Manten tu agenda organizada y asegurate de brindar un mejor servicio a tus clientes
                    </Text>
                    <Text style={styles.title}>Gestiona ya tus reservas</Text>
                    {reservas.map((reserva) => (
                        <View key={reserva.id_reserva} style={styles.card}>
                            <View style={styles.cardText}>
                                <Image source={{ uri: getImage(reserva.cliente_id) }} style={styles.image} />
                                <Text style={styles.cardClientServiceFhReserva}>
                                    Cliente:
                                    <Text style={styles.cardText2}> {getClientName(reserva.cliente_id)[0].nombre}</Text>
                                </Text>
                                <Text style={styles.cardClientServiceFhReserva}>
                                    Servicio:
                                    <Text style={styles.cardText2}> {getServiceName(reserva.servicio)}</Text>
                                </Text>
                                <Text style={styles.cardClientServiceFhReserva}>
                                    Fecha y hora:
                                    <Text style={styles.cardText2}> {new Date(reserva.fecha).toLocaleString()}</Text>
                                </Text>
                                <Text style={styles.cardClientServiceFhReserva}>
                                    Estado de la reserva:
                                    <Text style={styles.cardText2}> {reserva.estado}</Text>
                                </Text>
                            </View>

                            <View style={styles.botones}>
                                {finalizedReservations.includes(reserva.id_reserva) ? (
                                    <TouchableOpacity onPress={() => handleDelete(reserva.id_reserva)} style={styles.button2}>
                                        <Text style={styles.styleBtext}>Eliminar</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <>

                                        <TouchableOpacity onPress={() => handleAccept(reserva.id_reserva)} style={styles.button1}>
                                            <Text style={styles.styleBtext}>Aceptar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleFinalize(reserva.id_reserva)} style={styles.button3}>
                                            {isLoadingFinal && <ActivityIndicator size="small" color="#ffffff" />}
                                            <Text style={styles.styleBtext}>Finalizando</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => handleCancel(reserva.id_reserva)} style={styles.button2}>
                                            <Text style={styles.styleBtext}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                            </View>
                        </View>
                    ))}
                    {reservas.length === 0 && (
                        <Text style={styles.textInfo}>
                            No tienes reservas pendientes
                        </Text>
                    )}
                </View>
            </ScrollView>
        </DefaultLayout>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#212529',
    },
    welcome: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        alignItems: 'center',
        width: '100%',
        height: 100,
        marginBottom: 10,
    },
    MB: {
        fontSize: 28,
        fontFamily: 'BebasNeue',
        color: '#ffc107',
        textAlign: 'center',
    },
    dropdownMenu: {
        position: 'absolute',
        right: Dimensions.get('window').width * 0.2,
        backgroundColor: '#343a40',
        padding: 10,
        borderRadius: 5,
        marginTop: Dimensions.get('window').height * 0.05,
    },
    dropdownItem: {
        color: '#ffffff',
        fontSize: Dimensions.get('window').width * 0.04,
        paddingVertical: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 2,
        backgroundColor: '#212529',
        marginBottom: 1,
    },
    welcomeText: {
        fontSize: 32,
        fontFamily: 'BebasNeue',
        color: '#dc3545',
        marginTop: 30
    },
    welcomeName: {
        fontSize: 32,
        fontFamily: 'BebasNeue',
        color: '#ffc107',
        marginLeft: 10,
        marginTop: 30,
    },
    textInfo: {
        margin: 30,
        fontSize: 15,
        color: '#ffffff',
        marginBottom: 25,
        fontFamily: 'BebasNeue',
        textAlign: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'BebasNeue',
        color: '#ffffff',
        marginTop: 35,
    },
    card: {
        width: 320,
        height: 400,
        borderRadius: 20,
        margin: 30,
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#212529',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 35,
        alignSelf: 'center',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#6c757d',
    },
    cardText: {
        marginTop: 20,
    },
    cardClientServiceFhReserva: {
        fontSize: 18,
        color: '#ffc107',
        marginLeft: 45,
        fontFamily: 'BebasNeue',
    },
    cardText2: {
        fontSize: 18,
        color: '#ffffff',
    },
    botones: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    button1: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    button2: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    button3: {
        backgroundColor: '#ffc107',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    styleBtext: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    loading: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default GestionReservas;

function logout() {
    throw new Error('Function not implemented.');
}
