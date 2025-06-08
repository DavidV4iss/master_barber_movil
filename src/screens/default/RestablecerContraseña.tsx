import React, { useState, useRef } from 'react';
import { useFonts } from 'expo-font';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import DefaultLayout from '../../Layouts/DefaultLayout';
import AuthRepository from '../../repositories/AuthRepository';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';

const RestablecerContrasena = () => {
  const [user, setUser] = useState({
    newContrasena: '',
    confirmContra: '',
  });

  const navigation = useNavigation();
  const [iNPU, setCode] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);

  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    BebasNeue_400Regular,
  });

  const codeInput = (text, index) => {
    const newCode = [...iNPU];
    if (/^\d?$/.test(text)) {
      newCode[index] = text;
      setCode(newCode);

      if (text !== '' && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      } else if (text === '' && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlesubmit = async () => {
    const verificaCode = iNPU.join('');

    if (user.newContrasena.length < 8) {
      showMessage({
        message: 'La contraseña debe tener al menos 8 caracteres',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
      return;
    }

    if (user.newContrasena !== user.confirmContra) {
      showMessage({
        message: 'Las contraseñas no coinciden',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
      return;
    }

    if (verificaCode.length !== 6) {
      showMessage({
        message: 'El código debe tener 6 dígitos',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
      return;
    }

    try {
      const response = await AuthRepository.Cambiarpasscod(user, verificaCode);

      if (typeof response === 'string' && response.includes('éxito')) {
        showMessage({
          message: 'Contraseña restablecida con éxito',
          type: 'success',
          icon: 'success',
          duration: 4000,
        });
        navigation.navigate('LoginScreen');
      } else {
        showMessage({
          message: response || 'Error al restablecer la contraseña',
          type: 'danger',
          icon: 'danger',
          duration: 4000,
          style: { backgroundColor: 'gray' },
        });
      }
    } catch (error) {
      console.log('Error al enviar solicitud:', error.message);
      showMessage({
        message: error.message || 'Error inesperado al conectar con el servidor',
        type: 'danger',
        icon: 'danger',
        duration: 4000,
      });
    }
  };



  const handleChange = (text) => {
    setUser({ ...user, newContrasena: text });
  };

  const handleConfirmChange = (text) => {
    setUser({ ...user, confirmContra: text });
  };

  if (!fontsLoaded) return null;

  return (
    <DefaultLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Restablecer Contraseña</Text>
        <Image style={styles.image} source={require('../../assets/restablecer.png')} />
        <Text style={styles.textinfo}>
          Asegúrate de que tu contraseña sea segura y fácil de recordar. Si deseas, agrega caracteres especiales.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          placeholderTextColor="#aaa"
          value={user.newContrasena}
          onChangeText={handleChange}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#aaa"
          value={user.confirmContra}
          onChangeText={handleConfirmChange}
          secureTextEntry
        />
        <Text style={{ fontSize: 16, fontFamily: 'Anton', color: '#ffffff', marginTop: 25 }}>
          Ingresa aquí el código que recibiste por correo
        </Text>

        <View style={styles.codigoContainer}>
          {[...Array(6)].map((_, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              maxLength={1}
              keyboardType="numeric"
              value={iNPU[index]}
              onChangeText={(text) => codeInput(text, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handlesubmit}>
          <Text style={styles.buttonText}>Restablecer Contraseña</Text>
        </TouchableOpacity>
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    alignItems: 'center',
  },
  title: {
    marginTop: 40,
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 34,
    fontFamily: 'BebasNeue_400Regular',
    color: '#ffc107',
  },
  image: {
    width: 150,
    height: 120,
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 600,
  },
  textinfo: {
    fontSize: 15,
    fontFamily: 'Anton',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#ffc107',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FDFAF6',
    fontSize: 16,
    fontFamily: 'Anton',
  },
  codigoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#ffc107',
    textAlign: 'center',
    marginHorizontal: 2,
  },
});

export default RestablecerContrasena;
