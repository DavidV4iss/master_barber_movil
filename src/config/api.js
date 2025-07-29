// api.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getBaseURL = () => {
  // 👉 Siempre usar la API en Render si estamos en producción o en web
  if (process.env.NODE_ENV === 'production' || Platform.OS === 'web') {
    return 'https://api-de-master-barber.onrender.com';
  }

  // 👉 Si estás usando Expo Go en físico o emulador (desarrollo local)
  if (Constants.expoConfig?.hostUri) {
    const ip = Constants.expoConfig.hostUri.split(':')[0];
    return `http://${ip}:8080/`;
  }

  // Fallback por defecto (opcional)
  return 'http://localhost:8080/';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Interceptor para incluir token JWT en las peticiones (si existe)
API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  } catch (error) {
    console.error('Error al aplicar el token:', error);
    return config;
  }
});

export default API;
