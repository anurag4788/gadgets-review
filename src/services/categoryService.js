import api from "@/lib/api";

const categoryService = {

    getAll() {

        return api.get(
            "/categories"
        );

    },

    getBySlug(slug) {

        return api.get(
            `/categories/${slug}`
        );

    },

    create(data) {

        return api.post(
            "/categories",
            data
        );

    },

    update(slug, data) {

        return api.put(
            `/categories/${slug}`,
            data
        );

    },

    delete(slug) {

        return api.delete(
            `/categories/${slug}`
        );

    },

};

export default categoryService;