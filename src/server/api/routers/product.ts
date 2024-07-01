import { z } from "zod";
import productSchema from "~/lib/schemas/productSchema";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const productRouter = createTRPCRouter({
	create: publicProcedure.input(productSchema).mutation(async ({ input }) => {
		return db.product.create({
			data: {
				sku: input.sku,
				name: input.name,
				description: input.description,
				category: input.category,
				brand: input.brand
					? {
							connectOrCreate: {
								where: {
									name: input.brand,
								},
								create: {
									name: input.brand,
								},
							},
						}
					: null,
				color: input.color ?? null,
				material: input.material ?? null,
				probe: input.probe,
				inserts: {
					connectOrCreate: input.inserts.map((insert) => ({
						where: {
							type: insert,
						},
						create: {
							type: insert,
						},
					})),
				},
				stones: input.stones ?? null,
				price: input.price,
				oldPrice: input.oldPrice,
				weight: input.weight,
				size: input.size,
				productMedia: {
					createMany: {
						data: input.media.map((media) => ({
							filename: media.filename,
							order: media.order,
						})),
					},
				},
			},
		});
	}),
});
