// api.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Función para detectar la IP local o usar URL de desarrollo
export const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://api-de-master-barber.onrender.com'; // URL en producción
  }

  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:8080/';
  }

  if (Constants.expoConfig?.hostUri) {
    const ip = Constants.expoConfig.hostUri.split(':')[0];
    return `http://${ip}:8080/`;
  }

  return 'http://localhost:8080/';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Interceptor para incluir el token JWT si está guardado
API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  } catch (error) {
    console.error('Error al agregar token:', error);
    return config;
  }
});

export default API;
