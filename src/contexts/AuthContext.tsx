import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import AuthService from "../services/AuthService";
import { Text } from "react-native"


export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);
            try {
                const userData = await AuthService.validarToken();

                if (userData) {
                    setUser(userData);
                } else {
                    await AsyncStorage.removeItem('token');
                    setUser(null);
                }
            } catch (error) {
                console.error("Error loading user:", error);
                await AsyncStorage.removeItem('token');
                setUser(null);
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    const login = async (user) => {
        setIsLoading(true);
        try {
            const response = await AuthService.login(user);
            const token = response?.data?.token;
            if (token) {
                await AsyncStorage.setItem("token", token);
                setUser(response.data.user);
                showMessage({
                    message: "Bienvenido",
                    description: "Has iniciado sesión",
                    type: "success",
                    icon: "success",
                    duration: 2000
                })
            }
        } catch (error) {
            console.error("Error en login:", error);
            showMessage({
                message: "Error",
                description: error.message,
                type: "danger",
                icon: "danger",
            })
        }
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        await AsyncStorage.removeItem("token");
        showMessage({
            message: "Has cerrado sesión correctamente",
            icon: "success",
            duration: 2000,
            description: "Hasta pronto",
            type: "success",
        })
        setUser(null);
        setIsLoading(false);
    };
    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
