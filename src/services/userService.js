import api from "@/lib/api";

const userService = {

    getMe() {

        return api.get(
            "/users/me"
        );

    },

    updateMe(data) {

        return api.put(
            "/users/me",
            data
        );

    },

    getReviews(userId) {

        return api.get(
            `/users/${userId}/reviews`
        );

    },

    getAll(params = {}) {

        return api.get(
            "/admin/users",
            {
                params,
            }
        );

    },

    getById(id) {

        return api.get(
            `/admin/users/${id}`
        );

    },

};

export default userService;