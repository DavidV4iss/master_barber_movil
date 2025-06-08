import { showMessage } from "react-native-flash-message";
import API from "../config/api";

class PerfilRepository {
    static async TraerUsuario(email) {
        try {
            const response = await API.get(`traerUsuario/${email}`);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener el usuario.";
            throw new Error(errorMessage);
        }
    }

    static async actualizarUsuario(email, formData) {
        return API.post(`actualizarUsuario/${email}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

export default PerfilRepository;
