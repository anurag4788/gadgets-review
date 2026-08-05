import { z } from "zod";

export const brandSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Brand name must be at least 2 characters")
        .max(50, "Brand name cannot exceed 50 characters"),

    logo: z
        .string()
        .url("Logo must be a valid URL")
        .optional()
        .or(z.literal("")),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
        .or(z.literal("")),

    website: z
        .string()
        .url("Website must be a valid URL")
        .optional()
        .or(z.literal("")),
});