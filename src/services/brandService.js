import api from "@/lib/api";

const brandService = {

    getAll(params = {}) {

        return api.get(
            "/brands",
            {
                params,
            }
        );

    },


    getBySlug(slug) {

        return api.get(
            `/brands/${slug}`
        );

    },


    create(data) {

        return api.post(
            "/brands",
            data
        );

    },


    update(slug, data) {

        return api.put(
            `/brands/${slug}`,
            data
        );

    },


    delete(slug) {

        return api.delete(
            `/brands/${slug}`
        );

    },

};

export default brandService;