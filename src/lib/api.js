import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("accessToken");

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

    (response) => response,

    async (error) => {

        const originalRequest =
            error.config;


        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes(
                "/auth/refresh-token"
            )
        ) {

            originalRequest._retry = true;

            try {

                // IMPORTANT:
                // Use a separate Axios request
                // for refreshing the token.

                const refreshResponse =
                    await axios.post(

                        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,

                        {},

                        {
                            withCredentials: true,
                        }

                    );


                const newAccessToken =
                    refreshResponse.data.data.accessToken;


                // Save new access token

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );


                // Update original request

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


                // Retry original request

                return api(originalRequest);


            } catch (refreshError) {

                console.error(
                    "Refresh Token Failed:",
                    refreshError
                );

                localStorage.removeItem(
                    "accessToken"
                );

                return Promise.reject(
                    refreshError
                );

            }

        }


        return Promise.reject(error);

    }

);

export default api;