import { showMessage } from "react-native-flash-message";
import API from "../config/api";

class BarberosRepository {

    static async GetBarberos() {
        try {
            const response = await API.get("GetBarberos");
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener los barberos.";
            throw new Error(errorMessage);
        }
    }



    static async CreateBarberos(barbero) {
        try {
            const response = await API.post("CreateBarberos", barbero, { headers: { "Content-Type": "multipart/form-data" } });
            showMessage({
                message: "Barbero creado exitosamente",
                type: "success",
                icon: "success",
                duration: 2000,
            });
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data || "Error al crear el barbero.";
            showMessage({
                message: "Error al crear el barbero",
                description: errorMessage,
                type: "danger",
                icon: "danger",
            });
            throw new Error(errorMessage);
        }
    }

    
    static async UpdateBarberos(id, barberoEdit) {
        try {
            const response = await API.put(`UpdateBarberos/${id}`, barberoEdit, { headers: { "Content-Type": "multipart/form-data" } });
            showMessage({
                message: "Barbero actualizado exitosamente",
                type: "success",
                icon: "success",
                duration: 2000
            })
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al actualizar el barbero.";
            throw new Error(errorMessage);
        }
    }


    static async DeleteBarberos(id) {
        try {
            const response = await API.delete(`DeleteBarberos/${id}`);
            showMessage({
                message: "Barbero eliminado exitosamente",
                type: "success",
                icon: "success",
                duration: 2000
            })
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al eliminar el barbero.";
            showMessage({
                message: "Error al eliminar el barbero",
                description: errorMessage,
                type: "danger",
                icon: "danger",
            })
            throw new Error(errorMessage);
        }
    }

}

export default BarberosRepository