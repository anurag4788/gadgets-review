import api from "@/lib/api";

const wishlistService = {

    // ==========================================
    // GET MY WISHLIST
    // ==========================================

    getAll() {

        return api.get(
            "/wishlist"
        );

    },


    // ==========================================
    // ADD GADGET
    // ==========================================

    add(gadgetId) {

        return api.post(
            "/wishlist",
            {
                gadgetId,
            }
        );

    },


    // ==========================================
    // REMOVE GADGET
    // ==========================================

    remove(gadgetId) {

        return api.delete(
            `/wishlist/${gadgetId}`
        );

    },

};

export default wishlistService;