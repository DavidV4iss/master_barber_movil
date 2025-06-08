import { showMessage } from "react-native-flash-message";
import API from "../config/api";

class GestionInvRepository {

    static async GetVentas(rango) {
        try {
            const response = await API.get("GetVentas" + `?rango=${rango}`);
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener las ventas.";
            throw new Error(errorMessage);
        }
    }


    static async GuardarVentas(ventas) {
        try {
            const response = await API.post("GuardarVentas", ventas);

            showMessage({
                message: "Venta creada exitosamente",
                type: "success",
                icon: "success",
                duration: 2000,
            });
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data || "Error al crear la venta";
            showMessage({
                message: "Error al crear la venta",
                description: errorMessage,
                type: "danger",
                icon: "danger",
            });
            throw new Error(errorMessage);
        }
    }

    static async RestarInventario(id, cantidad) {
        try {
            const response = await API.put(`RestarInventario/${id}`, { cantidad });

            showMessage({
                message: "Inventario actualizado exitosamente",
                type: "success",
                icon: "success",
                duration: 2000
            })
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al actualizar el producto.";
            throw new Error(errorMessage);
        }
    }


    static async actualizarUsuario(email) {
        try {
            const response = await API.put(`actualizarUsuario/${email}`);

            showMessage({
                message: "Inventario actualizado exitosamente",
                type: "success",
                icon: "success",
                duration: 2000
            })
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al actualizar el producto.";
            throw new Error(errorMessage);
        }
    }

}

    

export default GestionInvRepository
