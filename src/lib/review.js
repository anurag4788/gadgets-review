import { prisma } from "@/lib/prisma";

export async function updateAverageRating(gadgetId) {

    const result =
        await prisma.review.aggregate({

            where: {
                gadgetId,
            },

            _avg: {
                rating: true,
            },

        });

    await prisma.gadget.update({

        where: {
            id: gadgetId,
        },

        data: {
            avgRating:
                result._avg.rating ?? 0,
        },

    });

}