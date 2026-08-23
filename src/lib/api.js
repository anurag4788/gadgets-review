import axios from "axios";

import {
    saveToken,
    removeToken,
    getToken,
} from "@/lib/authClient";


// ==========================================
// AXIOS INSTANCE
// ==========================================

const api = axios.create({

    baseURL:
        process.env.NEXT_PUBLIC_API_URL,

    withCredentials: true,

});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(

    (config) => {

        const token =
            getToken();


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) =>
        Promise.reject(error)

);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(

    // Successful response
    (response) =>
        response,


    // Error response
    async (error) => {

        const originalRequest =
            error.config;


        // ==========================================
        // ACCESS TOKEN EXPIRED
        // ==========================================

        if (

            error.response?.status === 401 &&

            originalRequest &&

            !originalRequest._retry &&

            !originalRequest.url?.includes(
                "/auth/refresh-token"
            )

        ) {

            // Prevent infinite refresh loop
            originalRequest._retry =
                true;


            try {

                // ==========================================
                // REFRESH ACCESS TOKEN
                // ==========================================

                const refreshResponse =
                    await axios.post(

                        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,

                        {},

                        {
                            withCredentials: true,
                        }

                    );


                // ==========================================
                // GET NEW ACCESS TOKEN
                // ==========================================

                const newAccessToken =
                    refreshResponse
                        .data
                        .data
                        .accessToken;


                // ==========================================
                // SAVE NEW TOKEN
                // ==========================================

                saveToken(
                    newAccessToken
                );


                // ==========================================
                // UPDATE ORIGINAL REQUEST
                // ==========================================

                originalRequest
                    .headers
                    .Authorization =
                    `Bearer ${newAccessToken}`;


                // ==========================================
                // RETRY ORIGINAL REQUEST
                // ==========================================

                return api(
                    originalRequest
                );


            } catch (refreshError) {

                console.error(
                    "Refresh Token Failed:",
                    refreshError
                );


                // ==========================================
                // LOGOUT LOCALLY
                // ==========================================

                removeToken();


                return Promise.reject(
                    refreshError
                );

            }

        }


        return Promise.reject(
            error
        );

    }

);


export default api;