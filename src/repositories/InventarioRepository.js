import { showMessage } from "react-native-flash-message";
import API from "../config/api";

class InventarioRepository {

    static async GetInventario() {
        try {
            const response = await API.get("GetInventario");
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener los productos.";
            throw new Error(errorMessage);
        }
    }


    static async categorias() {
        try {
            const response = await API.get("categorias");
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al obtener los productos.";
            throw new Error(errorMessage);
        }
    }

    static async CreateInventario(inventario) {
        try {
            const response = await API.post("CreateInventario", inventario, { headers: { "Content-Type": "multipart/form-data" } });
            showMessage({
                message: "Producto creado exitosamente",
                type: "success",
                icon: "success",
                duration: 2000,
            });
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data || "Error al crear el Producto.";
            showMessage({
                message: "Error al crear el Poducto",
                description: errorMessage,
                type: "danger",
                icon: "danger",
            });
            throw new Error(errorMessage);
        }
    }

    static async UpdateInventario(id, productoEditar) {
        try {
            const response = await API.put(`UpdateInventario/${id}`, productoEditar, { headers: { "Content-Type": "multipart/form-data" } });
            showMessage({
                message: "Producto actualizado exitosamente",
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

    static async DeleteInventario(id) {
        try {
            const response = await API.delete(`DeleteInventario/${id}`);
            showMessage({
                message: "Producto eliminado exitosamente",
                type: "success",
                icon: "success",
                duration: 2000
            })
            return response;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error al eliminar el producto.";
            showMessage({
                message: "Error al eliminar el producto",
                description: errorMessage,
                type: "danger",
                icon: "danger",
            })
            throw new Error(errorMessage);
        }
    }

}

export default InventarioRepository
