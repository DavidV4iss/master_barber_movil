import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getBaseURL = () => {
  if (Platform.OS === 'web' && process.env.NODE_ENV !== 'production') {
    return 'http://localhost:8080';
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://master-barber-api-va0x.onrender.com';
  }

  if (Constants.expoConfig?.hostUri) {
    const ip = Constants.expoConfig.hostUri.split(':')[0];
    return `http://${ip}:8080/`;
  }

  return 'http://localhost:8080';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

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
