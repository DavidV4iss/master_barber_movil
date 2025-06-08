import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useFonts } from "expo-font";
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import DefaultLayout from "../../Layouts/DefaultLayout";
import AuthRepository from "../../repositories/AuthRepository";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";

const OlvidoContraseña = () => {

  const [fontsLoaded] = useFonts({
    Anton: Anton_400Regular,
    BebasNeue_400Regular,
  });

  const navigation = useNavigation();
  const [user, setUser] = useState({
    email: ""
  });

  const handleEmailChange = (text) => {
    setUser({ ...user, email: text });
  };

  const handlesubmit = async () => {
    try {
      const response = await AuthRepository.EnvEmail(user);
      if (response) {
        showMessage({
          message: "Se ha enviado el código de recuperación a tu correo",
          type: "success",
          icon: "success",
          duration: 4000,
        });

        navigation.navigate("RestablecerContrasena");
      } else {
        showMessage({
          message: "Error al enviar el correo",
          type: "danger",
          icon: "danger",
          duration: 4000,
          style: { backgroundColor: "gray" },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


  if (!fontsLoaded) {
    return null;
  }

  return (
    <DefaultLayout>
      <View style={styles.container}>
        <Text style={styles.tittle}>¿Olvidaste tu contraseña?</Text>
        <Image style={styles.image} source={require("../../assets/recuperar.png")} />
        <Text style={styles.textinfo}>
          Ingrese su correo electrónico para poder enviar un código de recuperación
        </Text>
        <Text style={styles.textinput}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          value={user.email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button1} onPress={handlesubmit} >
          <Text style={styles.buttonText1}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 200,
    alignSelf: "center",
  },
  tittle: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 34,
    fontFamily: "BebasNeue_400Regular",
    color: "#ffc107",
  },
  textinfo: {
    fontSize: 15,
    fontFamily: "Anton",
    color: "#ffffff",
    marginTop: 10,
    paddingHorizontal: 35,
    textAlign: "center",
  },
  textinput: {
    fontSize: 12,
    fontFamily: "Anton",
    color: "#ffffff",
    marginTop: 40,
    marginBottom: 2,
    paddingHorizontal: 35,
  },
  input: {
    width: 270,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  button1: {
    width: 150,
    height: 50,
    backgroundColor: "#ffc107",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText1: {
    color: "#FDFAF6",
    fontSize: 16,
    fontFamily: "Anton",
    marginBottom: 5,
  },
});

export default OlvidoContraseña;
