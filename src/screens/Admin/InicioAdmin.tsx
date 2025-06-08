import React, { useState } from 'react';
import { useFonts } from "expo-font";
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import useAuth from "../../hooks/useAuth";
import BarberosRepository from '../../repositories/BarberosRepository';
import DefaultLayout from '../../Layouts/DefaultLayout';
import CalificacionesAdmin from '../../components/CalificacionesAdmin';


export default function InicioAdmin() {
    const [isHovered, setIsHovered] = useState(false);
    const navigation = useNavigation();
    const [barberos, setBarberos] = useState([]);

    const { logout } = useAuth()

    const [fontsLoaded] = useFonts({
        BebasNeue_400Regular,
        Anton_400Regular
    });

    React.useEffect(() => {
        const fetchBarberos = async () => {
            try {
                const response = await BarberosRepository.GetBarberos();
                setBarberos(response.data);
            } catch (err) {
                console.log("Error al obtener los datos:", err);
            }
        };

        fetchBarberos();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    const handleLogout = () => {
        logout();
    }

    return (
        <DefaultLayout>
            <View style={{ flex: 1, backgroundColor: '#212529' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Icon name="bars" size={Dimensions.get('window').width * 0.08} color="#ffffff" style={styles.iconBars} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <Icon name="sign-out" size={Dimensions.get('window').width * 0.08} color="#ffffff" style={styles.iconUser} />
                    </TouchableOpacity >
                </View>

                <ScrollView>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>
                            MASTER <Text style={{ color: '#dc3545' }}>BARBER</Text> | INICIO
                        </Text>
                    </View>

                    <View style={styles.menuContainer}>
                        <Text style={styles.menuTitle}>MENUUUUU</Text>
                        <View style={styles.divider} />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.menuLink}>LINKS AYUDAS</Text>
                                <Text style={styles.menuLinkHighlighted}>GESTION BARBEROS</Text>
                                <Text style={styles.menuLinkHighlighted}>INVENTARIO</Text>
                                <Text style={styles.menuLinkHighlighted}>GESTION INVENTARIO</Text>
                            </View>
                            <View
                                style={{
                                    transform: [{ scale: isHovered ? 1.1 : 1 }],
                                    marginLeft: Dimensions.get('window').width * 0.05,
                                }}
                                onTouchStart={() => setIsHovered(true)}
                                onTouchEnd={() => setIsHovered(false)}
                            >
                                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.barbersContainer}>
                        <Text style={styles.barbersTitle}>BARBEROS ACTUALES</Text>
                        {barberos.map((barbero, index) => (
                            <View key={index} style={styles.divider}>
                                <Text style={{ ...styles.barberItem, color: '#dc3545', fontFamily: 'BebasNeue_400Regular', fontSize: 20 }}>{barbero.nombre_usuario}</Text>
                                <Text style={styles.barberItem}>{barbero.descripcion}</Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        <CalificacionesAdmin />
                    </View>
                </ScrollView>
            </View>
        </DefaultLayout>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '70%',
        height: '100%',
        backgroundColor: '#212529',
        padding: 20,
        zIndex: 10,
    },
    sidebarTitle: {
        letterSpacing: 4,
        fontFamily: 'bebasNeue_400Regular',
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffffff',
        alignSelf: 'center',
    },
    sidebarButton: {
        borderWidth: 1,
        borderColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    sidebarButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeSidebarButton: {
        marginTop: 20,
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        marginLeft: 50,
    },
    closeSidebarButtonText: {
        color: '#ffffff',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Dimensions.get('window').width * 0.05,
        paddingTop: 20,
        backgroundColor: '#212529',
        marginBottom: 15,
    },

    titleContainer: {
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.04,
    },
    titleText: {
        color: '#ffffff',
        fontSize: Dimensions.get('window').width * 0.1,
        textAlign: 'center',
        fontFamily: 'BebasNeue_400Regular',
        marginTop: Dimensions.get('window').height * 0.05,
    },
    menuContainer: {
        marginTop: Dimensions.get('window').height * 0.05,
        paddingHorizontal: Dimensions.get('window').width * 0.05,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    menuTitle: {
        color: '#ffffff',
        fontSize: Dimensions.get('window').width * 0.06,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 8,
        marginTop: Dimensions.get('window').height * 0.01,
    },
    divider: {
        borderBottomColor: '#ffffff',
        marginVertical: 10,
    },
    menuLink: {
        color: '#ffffff',
        fontSize: Dimensions.get('window').width * 0.04,
        marginBottom: 10,
    },
    menuLinkHighlighted: {
        color: '#ffc107',
        fontSize: Dimensions.get('window').width * 0.04,
        marginBottom: 5,
        textDecorationLine: 'underline',
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 50,
        marginBottom: 50,
    },
    barbersContainer: {
        paddingHorizontal: Dimensions.get('window').width * 0.05,
        borderWidth: 1,
        borderColor: '#ffffff',
        marginTop: Dimensions.get('window').height * 0.09,
        marginBottom: Dimensions.get('window').height * 0.08,
    },
    barbersTitle: {
        color: '#ffffff',
        fontSize: Dimensions.get('window').width * 0.05,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * 0.03,
        marginBottom: 16,
    },
    barberItem: {
        color: '#ffffff',
        fontSize: Dimensions.get('window').width * 0.04,
        marginBottom: 5,
    },
    iconBars: {
        marginLeft: 10,
        marginTop: Dimensions.get('window').height * 0.02,
    },
    iconUser: {
        marginRight: 10,
        marginTop: Dimensions.get('window').height * 0.02,
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
},
);


