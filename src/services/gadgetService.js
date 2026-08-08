import api from "@/lib/api";

const gadgetService = {

    getAll(params = {}) {

        return api.get(
            "/gadgets",
            {
                params,
            }
        );

    },


    getBySlug(slug) {

        return api.get(
            `/gadgets/${slug}`
        );

    },


    create(data) {

        return api.post(
            "/gadgets",
            data
        );

    },


    update(slug, data) {

        return api.put(
            `/gadgets/${slug}`,
            data
        );

    },


    delete(slug) {

        return api.delete(
            `/gadgets/${slug}`
        );

    },

};

export default gadgetService;