import AuthRepository from "../repositories/AuthRepository";
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
    static async registrar(user) {
        try {
            const response = await AuthRepository.registrar(user);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al registrar el usuario.";
            throw new Error(errorMessage);
        }
    }

    static async login(user) {
        try {
            const response = await AuthRepository.login(user);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al iniciar sesión.";
            throw new Error(errorMessage);
        }
    }

    static async validarToken() {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return null;

            const response = await AuthRepository.validarToken(token);

            if (response?.data?.user) {
                return {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    role: response.data.user.role
                };
            }

            return null;
        } catch (error) {
            console.warn("Error validando token:", error.message);
            await AsyncStorage.removeItem('token');
            return null;
        }
    }
    static async getToken() {
        try {
            const token = await AsyncStorage.getItem("token");
            return token || null;
        } catch (error) {
            return null;
        }
    }

}

export default AuthService