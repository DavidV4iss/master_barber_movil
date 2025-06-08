import { showMessage } from "react-native-flash-message";
import API from "../config/api";

class ReservasClientesRepository {

    //RESERVAS DE CLIENTES 
    static async GetReservas() {
        try {
            const response = await API.get("GetReservas");
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener las reservas.";
            throw new Error(errorMessage);
        }
    }

    static async GetServicios() {
        try {
            const response = await API.get("GetServicios");
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener los servicios.";
            throw new Error(errorMessage);
        }
    }

    static async GetBarberos() {
        try {
            const response = await API.get("GetBarberos");
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener los barberos.";
            throw new Error(errorMessage);
        }
    }

    static async GetBarberosDisponibles(barberoId) {
        try {
            const response = await API.get(`GetReservas/barbero/${barberoId}`);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener las reservas del barbero.";
            throw new Error(errorMessage);
        }
    }

    static async CrearReservas(reserva) {
        try {
            const response = await API.post("CrearReservas", reserva);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data || "Error al crear la reserva.";
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

    static async GetClientes() {
        try {
            const response = await API.get("GetClientes");
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener los clientes.";
            throw new Error(errorMessage);
        }
    }

    static async UpdateReservasEstado(id, estado) {
        try {
            const response = await API.patch(`UpdateReservasEstado/${id}`, { estado });
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al actualizar la reserva.";
            throw new Error(errorMessage);
        }
    }

    static async DeleteReservas(id) {
        try {
            const response = await API.delete(`DeleteReservas/${id}`);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al eliminar la reserva.";
            throw new Error(errorMessage);
        }
    }
    ///

    ///NOTIFICACIONES
        static async GetNotificaciones(id) {
            try {
                const response = await API.get(`GetNotificaciones/${id}`);
                return response;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Error al obtener las notificaciones.";
                throw new Error(errorMessage);
            }
        }

        static async DeleteNotificacion(id_notificacion) {
            try {
                const response = await API.delete(`DeleteNotificacion/${id_notificacion}`);
                return response;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Error al eliminar la notificación de reserva.";
                throw new Error(errorMessage);
            }
        }

    





}

export default ReservasClientesRepository;