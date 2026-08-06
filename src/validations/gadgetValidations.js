import { z } from "zod";

export const gadgetSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    model: z
        .string()
        .trim()
        .min(2, "Model is required")
        .max(100, "Model cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(3000, "Description cannot exceed 3000 characters"),

    image: z
        .string()
        .url("Invalid image URL")
        .optional()
        .or(z.literal("")),

    releaseYear: z
        .number({
            invalid_type_error: "Release year must be a number",
        })
        .int()
        .min(1990)
        .max(new Date().getFullYear() + 2)
        .optional(),

    brandId: z
        .string()
        .min(1, "Brand is required"),

    categoryId: z
        .string()
        .min(1, "Category is required"),
});