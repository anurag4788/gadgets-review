import api from "@/lib/api";

const authService = {

    register(data) {

        return api.post(
            "/auth/register",
            data
        );

    },


    login(data) {

        return api.post(
            "/auth/login",
            data
        );

    },


    getCurrentUser() {

        return api.get(
            "/users/me"
        );

    },

};

export default authService;