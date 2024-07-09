import { ProductStatus } from "@prisma/client";
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
					: undefined,
				color: input.color,
				material: input.material,
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
				stones: input.stones,
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
				status: ProductStatus.Published,
			},
		});
	}),

	getDashboardProductList: publicProcedure
		.input(z.object({ skip: z.number(), take: z.number() }))
		.query(({ input }) => {
			return db.product.findMany({
				where: {},
				include: {
					productMedia: true,
				},
				skip: input.skip,
				take: input.take,
			});
		}),

	getProduct: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ input }) => {
			return db.product.findUnique({
				where: {
					id: input.id,
				},
				include: {
					inserts: true,
					productMedia: {
						include: {
							media: true,
						},
					},
				},
			});
		}),

	update: publicProcedure.input(productSchema).mutation(async ({ input }) => {
		if (!input.id) throw new Error("Product Not Found");

		return db.product.update({
			where: {
				id: input.id,
			},
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
					: undefined,
				color: input.color,
				material: input.material,
				probe: input.probe,
				inserts: {
					deleteMany: {},
					connectOrCreate: input.inserts.map((insert) => ({
						where: {
							type: insert,
						},
						create: {
							type: insert,
						},
					})),
				},
				stones: input.stones,
				price: input.price,
				oldPrice: input.oldPrice,
				weight: input.weight,
				size: input.size,
				productMedia: {
					deleteMany: {},
					createMany: {
						data: input.media.map((media) => ({
							filename: media.filename,
							order: media.order,
						})),
					},
				},
				status: ProductStatus.Published,
			},
		});
	}),
});
