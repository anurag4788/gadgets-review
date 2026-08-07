import { z } from "zod";

export const wishlistSchema = z.object({

    gadgetId: z
        .string()
        .min(1, "Gadget is required"),

});