import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, Dimensions } from "react-native";
import { useFonts } from "expo-font";
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { useNavigation } from "@react-navigation/native";
import DefaultLayout from "../../Layouts/DefaultLayout";
import useAuth from "../../hooks/useAuth";
import { showMessage } from "react-native-flash-message";

export default function Login() {

  const { login } = useAuth()
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fontsLoaded] = useFonts({
    Anton: Anton_400Regular,
    BebasNeue_400Regular,
  });

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      const msg = "Todos los campos son obligatorios";
      showMessage({
        message: "Error",
        description: msg,
        type: "warning",
        icon: "warning",
      });
      return;
    }
    const user = {
      email,
      password,
    }
    await login(user);
  };

  return (
    <DefaultLayout>
      <View style={styles.container}>
        <Text style={styles.title}>¡ Bienvenido ! </Text>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>Inicia Sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.registrate} >
          ¿No tienes una cuenta?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate('RegistrarScreen')}>
            Regístrate
          </Text>
        </Text>
        <Text
          style={styles.olvidopassword}
          onPress={() => navigation.navigate('OlvidoContraseñaScreen')}
        >
          ¿Olvidaste tu contraseña?
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 38,
    fontFamily: "Anton",
    color: "#fff",
    marginBottom: 10,
    marginTop : 40
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 15,
    fontFamily: "BebasNeue_400Regular",
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 25,
    borderRadius: 300,
    boxShadow: "px   5px 5px  rgba(255, 255, 255, 0.3)",
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  registrate: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Anton",
    marginTop: 5,
  },
  link: {
    color: "#5495ff",
    textDecorationLine: "underline",
    fontFamily: "Anton",
  },
  olvidopassword: {
    color: "#5495FF",
    fontSize: 12,
    fontFamily: "Anton",
    marginBottom: 10,
    textDecorationLine: "underline",

  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: "#ffc107",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,

  },
  buttonText: {
    color: "#FDFAF6",
    fontSize: 16,
    fontFamily: "Anton",
    marginBottom: 5,
  },

});