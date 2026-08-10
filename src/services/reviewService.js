import api from "@/lib/api";

const reviewService = {

    getAll(params = {}) {

        return api.get(
            "/reviews",
            {
                params,
            }
        );

    },


    create(data) {

        return api.post(
            "/reviews",
            data
        );

    },


    update(id, data) {

        return api.put(
            `/reviews/${id}`,
            data
        );

    },


    delete(id) {

        return api.delete(
            `/reviews/${id}`
        );

    },


    like(id) {

        return api.post(
            `/reviews/${id}/like`
        );

    },

    unlike(id) {

        return api.delete(
            `/reviews/${id}/like`
        );

    },

};

export default reviewService;