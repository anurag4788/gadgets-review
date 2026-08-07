import { z } from "zod";

const reviewFields = {

    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),

    review: z
        .string()
        .trim()
        .min(20, "Review must be at least 20 characters")
        .max(5000, "Review cannot exceed 5000 characters"),

    rating: z
        .number({
            invalid_type_error: "Rating must be a number",
        })
        .int()
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5"),

};

export const createReviewSchema =
    z.object({

        ...reviewFields,

        gadgetId: z
            .string()
            .min(1, "Gadget is required"),

    });

export const updateReviewSchema =
    z.object(reviewFields);