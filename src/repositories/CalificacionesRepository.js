import { showMessage } from "react-native-flash-message";
import API from "../config/api";

class BarberosRepository {

    static async traerCalificaciones() {
        try {
            const response = await API.get("traerCalificaciones");
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener los barberos.";
            throw new Error(errorMessage);
        }
    }

    static async traerCalificacionesUsuario() {
        try {
            const token = await AsyncStorage.getItem("token");
            const tokenDecoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
            const id = tokenDecoded?.id || null;
            if (!token) {
                throw new Error("Token no encontrado");
            }
            console.log("ID del usuario:", id);
            const response = await API.get(`traerCalificacionesUsuario/${id}`);
            console.log("Respuesta de calificaciones:", response);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener los barberos.";
            throw new Error(errorMessage);
        }
    }

    static async TraerUsuario(email) {
        try {
            const response = await API.get(`traerUsuario/${email}`);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener el usuario.";
            throw new Error(errorMessage);
        }

    }



    static async Createcalificaciones(calificaciones) {
        try {
            const response = await API.post("Createcalificaciones", calificaciones);
            showMessage({
                message: "Calificación creada exitosamente",
                type: "success",
                icon: "success",
                duration: 2000,
            });
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data || "Error al crear el barbero.";
            showMessage({
                message: "Error al crear la calificación",
                description: errorMessage,
                type: "danger",
                icon: "danger",
            });
            throw new Error(errorMessage);
        }
    }


    static async DeleteCalificaciones(id) {
        try {
            const response = await API.delete(`DeleteCalificaciones/${id}`);
            showMessage({
                message: "Calificación eliminada exitosamente",
                type: "success",
                icon: "success",
                duration: 2000
            })
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al eliminar el barbero.";
            showMessage({
                message: "Error al eliminar la calificación",
                description: errorMessage,
                type: "danger",
                icon: "danger",
            })
            throw new Error(errorMessage);
        }
    }

}

export default BarberosRepository