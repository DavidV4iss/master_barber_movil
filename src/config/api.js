import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getBaseURL = () => {
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

API.interceptors.request.use(async (config) => {
    try {
        return config;
    } catch (error) {
        return null;
    }

});

export default API;