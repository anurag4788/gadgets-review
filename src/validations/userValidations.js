import { z } from "zod";

export const updateUserSchema = z.object({

    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address."),

});