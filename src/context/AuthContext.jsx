"use client";

import { getToken } from "@/lib/authClient";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import authService from "@/services/authService";
import userService from "@/services/userService";

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


    // ==========================================
    // LOAD CURRENT USER
    // ==========================================

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

        } catch (error) {

            console.error(
                "Load User Error:",
                error
            );

            setUser(null);

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LOGIN
    // ==========================================

    async function login(data) {

        const response =
            await authService.login(data);

        saveToken(
            response.data.data.accessToken
        );

        await loadUser();

    }


    // ==========================================
    // REGISTER
    // ==========================================

    async function register(data) {

        return authService.register(data);

    }


    // ==========================================
    // UPDATE CURRENT USER
    // ==========================================

    async function updateUser(data) {

        const response =
            await userService.updateMe(data);

        setUser(
            response.data.data
        );

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    function logout() {

        removeToken();

        setUser(null);

    }


    // ==========================================
    // CONTEXT
    // ==========================================

    return (

        <AuthContext.Provider
            value={{

                user,

                loading,

                login,

                logout,

                register,

                updateUser,

                isAuthenticated:
                    !!user,

            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


// ==========================================
// useAuth HOOK
// ==========================================

export function useAuth() {

    return useContext(
        AuthContext
    );

}