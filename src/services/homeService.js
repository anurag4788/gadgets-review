import api from "@/lib/api";

const homeService = {

    getHomeData() {
        return api.get("/home");
    },

};

export default homeService;