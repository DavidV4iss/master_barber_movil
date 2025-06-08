import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from "react-native";
import { useFonts } from "expo-font";
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import DefaultLayout from "../../Layouts/DefaultLayout";
import ReservasClientesRepository from "../../repositories/ReservasClientesRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReservasNoti() {
    const [cliente, setCliente] = useState(null);
    const [notificaciones, setNotificaciones] = useState([]);

    const [fontsLoaded] = useFonts({
        Anton: Anton_400Regular,
        BebasNeue: BebasNeue_400Regular,
    });


    const fetchNotificaciones = async () => {
        try {
            const res = await ReservasClientesRepository.GetNotificaciones(cliente.id_usuario);

            if (Array.isArray(res.data)) {
                setNotificaciones(res.data);
            } else {
                console.warn("Respuesta inesperada, se esperaba un array:", res.data);
                setNotificaciones([]);
            }

            console.log("Notificaciones obtenidas:", res.data); 

        } catch (err) {
            console.error("Error al obtener las notificaciones:", err);
            setNotificaciones([]); 
        }
    };
    

    React.useEffect(() => {
        if (cliente) {
            fetchNotificaciones();
        }
    }, [cliente]);

    const fetchTraerUsuarios = async (email) => {
        try {
            const response = await ReservasClientesRepository.TraerUsuario(email);
            setCliente(response.data[0]);
        } catch (err) {
            console.log("Error al obtener los datos del barbero:", err);
        }
      };

    React.useEffect(() => {
        if (!fontsLoaded) {
            return;
        }
        
        AsyncStorage.getItem("token").then((token) => {
            const tokenDecoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
            const email = tokenDecoded?.email;
            if (email) {
                fetchTraerUsuarios(email);
            }
        });
    }, []);

    const DeleteNotificacion = async (id_notificacion) => {
        try {
            const response = await ReservasClientesRepository.DeleteNotificacion(id_notificacion);
            if (response.status === 200) {
                Alert.alert("Éxito", "Notificación eliminada correctamente");
                setNotificaciones(notificaciones.filter(noti => noti.id_notificacion !== id_notificacion));
            } else {
                Alert.alert("Error", "No se pudo eliminar la notificación");
            }
        } catch (error) {
            console.error("Error al eliminar la notificación:", error);
            Alert.alert("Error", "Ocurrió un error al eliminar la notificación");
        }
    };

    if (!fontsLoaded || !cliente) {
        return <Text>Cargando...</Text>; // O un componente de carga
    }


    return (
        <DefaultLayout>
            <View style={styles.container}>
                <Text style={styles.tittle}>RESERVAS</Text>
                <Text style={styles.Texto}>
                    <Text style={{ color: "#ffffff", fontSize: 20, marginRight: 2 }}>Hola </Text>
                    {cliente ? cliente.nombre_usuario : "Cargando..."}
                    <Text style={{ color: "#ffffff", fontSize: 20, marginRight: 2 }}> mira tus reservas notificadas:</Text>
                </Text>

                {notificaciones.length > 0 ? (
                    notificaciones.map((noti) => (
                        <View key={noti.id_notificacion} style={styles.cardNotificacion}>
                            <Text style={styles.detallesReserva}><Text style={{color: "#ffc107" }}>Mensaje:</Text> {noti.mensaje}</Text>
                            
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => DeleteNotificacion(noti.id_notificacion)}
                            >
                                <Text style={styles.textButton}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center",borderBlockColor: "#dc3545", backgroundColor: "#343a40", width: "90%", height: 150, borderRadius: 10, padding: 20 }}>
                            <Text style={styles.Texto}>No tienes ninguna reserva notificada.</Text>
                    </View>
                    
                )}

            </View>

        </DefaultLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212529",
        alignContent: "center",
        alignItems: "center",
    },
    tittle: {
        marginTop: 40,
        marginBottom: 10,
        textAlign: "center",
        fontSize: 34,
        fontFamily: "BebasNeue",
        color: "#dc3545",
    },
    cardNotificacion: {
        backgroundColor: "#343a40",
        width: "90%",
        height: 150,
        borderEndColor: "#dc3545",
        borderEndWidth: 5,
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,

    },
    Texto: {
        fontSize: 20,
        fontFamily: "BebasNeue",
        color: "#ffc107",
        marginBottom: 10,
        
    },
    detallesReserva: {
        fontSize: 14,
        fontFamily: "Anton",
        color: "#ffffff",
    },
    button: {
        width: "35%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#dc3545",
        borderRadius: 5,
        padding: 10,
        marginLeft: 190,
        position: "absolute",
        bottom: 10,
    },
    textButton: {
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "Anton",
    },


})
