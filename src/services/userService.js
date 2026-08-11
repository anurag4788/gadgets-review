import api from "@/lib/api";

const userService = {

    getMe() {

        return api.get(
            "/users/me"
        );

    },
    getReviews(userId) {

        return api.get(
            `/users/${userId}/reviews`
        );

    },

};

export default userService;