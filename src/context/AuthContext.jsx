"use client";

import { getToken } from "@/lib/authClient";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import authService from "@/services/authService";

import {
    saveToken,
    removeToken,
} from "@/lib/authClient";

const AuthContext =
    createContext(null);

export function AuthProvider({
    children,
}) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (getToken()) {

            loadUser();

        } else {

            setLoading(false);

        }

    }, []);

    async function loadUser() {

        try {

            const response =
                await authService.getCurrentUser();

            setUser(
                response.data.data
            );

        } catch (error){
            console.error(error);


            setUser(null);

        } finally {

            setLoading(false);

        }

    }

    async function login(data) {

        const response =
            await authService.login(data);

        saveToken(
            response.data.data.accessToken
        );

        await loadUser();

    }

    async function register(data) {

        return authService.register(data);

    }

    function logout() {

        removeToken();

        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                register,
                isAuthenticated:
                    !!user,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}