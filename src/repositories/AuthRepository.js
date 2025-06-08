import API from "../config/api";
import { getToken } from '../utils/Auth'
class AuthRepository {
    static async registrar(user) {
        try {
            const response = await API.post("registrar", user);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al registrar el usuario.";
            throw new Error(errorMessage);
        }
    }

    static async login(user) {
        try {
            const response = await API.post("login", user);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al iniciar sesión.";
            throw new Error(errorMessage);
        }
    }

    static async validarToken(token) {
        try {
            if (!token) return null;

            const response = await API.get("validarToken", {
                headers: {
                    Authorization: token,
                },
            });

            return response;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await AsyncStorage.removeItem('token');
            }
            throw error;
        }
    }

    static async EnvEmail(user) {
        try {
            const response = await API.post("EnvEmail", user);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al enviar el código.";
            throw new Error(errorMessage);
        }
    }
    static async Cambiarpasscod(user, verificaCode) {
        try {
            const payload = {
                ...user,
                verificaCode,
            };
            const response = await API.post("Cambiarpasscod", payload);
            return response.data; // ← ahora retornamos solo el texto plano
        } catch (error) {
            const errorMessage = error?.response?.data || "Error al restablecer la contraseña.";
            throw new Error(errorMessage);
        }
    }


}
export default AuthRepository