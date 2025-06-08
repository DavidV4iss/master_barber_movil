import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Dimensions, Platform, Button, Alert } from "react-native";
import { useFonts } from "expo-font";
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { useNavigation } from "@react-navigation/native";
import AuthService from "../../services/AuthService";
import DefaultLayout from "../../Layouts/DefaultLayout";

const { width, height } = Dimensions.get("window");

export default function Register() {
    const navigation = useNavigation();
    const [fontsLoaded] = useFonts({
        Anton: Anton_400Regular,
    });

    const [user, setUser] = useState({
        nombre_usuario: '',
        email: '',
        nit: '',
        telefono: '',
        contraseña: '',
        confirmar_contraseña: ''

    })

    const handleChange = (data) => (value) => {
        setUser({ ...user, [data]: value })
    }
    const handleSubmit = async () => {
        try {
            const response = await AuthService.registrar(user);
            if (response.status == 200) {
                alert("El usuario se ha registrado correctamente.");
                navigation.navigate("LoginScreen");
            }
            else {
                alert(`El usuario no se ha registrado correctamente. ${response.data.message}`)
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al registrar el usuario.";
            alert(errorMessage);
        }
    }


    return (
        <DefaultLayout>
            <View style={styles.container}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                />
                <Text style={styles.subtitle}>Registro de Usuario</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de Usuario"
                    placeholderTextColor="#fff"
                    onChangeText={handleChange('nombre_usuario')}
                    value={user.nombre_usuario}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#fff"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange('email')}
                    value={user.email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="NIT"
                    placeholderTextColor="#fff"
                    keyboardType="numeric"
                    onChangeText={handleChange('nit')}
                    value={user.nit}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    placeholderTextColor="#fff"
                    keyboardType="phone-pad"
                    onChangeText={handleChange('telefono')}
                    value={user.telefono}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#fff"
                    secureTextEntry
                    onChangeText={handleChange('contraseña')}
                    value={user.contraseña}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar Contraseña"
                    placeholderTextColor="#fff"
                    secureTextEntry
                    onChangeText={handleChange('confirmar_contraseña')}
                    value={user.confirmar_contraseña}
                />
                <Text style={styles.footerText}>
                    ¿Ya tienes cuenta?{" "}
                    <Text style={styles.link} onPress={() => navigation.navigate("LoginScreen")} >
                        Inicia sesión
                    </Text>
                </Text>
                <TouchableOpacity onPress={handleSubmit} style={styles.button} >
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
            </View>
        </DefaultLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212529",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: width * 0.05,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        borderRadius: 300,
        boxShadow: "px   5px 5px  rgba(255, 255, 255, 0.3)",
    },
    title: {
        fontSize: width * 0.08,
        fontFamily: "Anton",
        color: "#fff",
        marginBottom: height * 0.01,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 15,
        fontFamily: "BebasNeue_400Regular",
        color: "#FDFAF6",
    },

    input: {
        width: 300,
        height: 50,
        backgroundColor: "#333",
        borderRadius: 8,
        paddingHorizontal: 10,
        color: "#ffc107",
        marginBottom: height * 0.015,
        borderWidth: 2,
        borderColor: "#fff",
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: "#ffc107",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: "#FDFAF6",
        fontSize: 16,
        fontFamily: "Anton",
        marginBottom: 5,
    },
    footerText: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "Anton",
        marginBottom: 10,
    },
    link: {
        color: "#5495ff",
        textDecorationLine: "underline",
        fontFamily: "Anton",
    },
});


