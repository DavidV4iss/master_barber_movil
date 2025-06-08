import { showMessage } from "react-native-flash-message";
import API from "../config/api";

class UsuariosRepository {

    static async traerUsuarios() {
        try {
            const response = await API.get(`traerUsuarios`);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener el usuario.";
            throw new Error(errorMessage);
        }

    }



}

export default UsuariosRepository