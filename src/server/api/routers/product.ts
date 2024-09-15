import { ProductCategory, ProductStatus } from "@prisma/client";
import { z } from "zod";
import productSchema from "~/lib/schemas/productSchema";

import {
	adminProtectedProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const productRouter = createTRPCRouter({
	create: adminProtectedProcedure
		.input(productSchema)
		.mutation(async ({ input }) => {
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

	getDashboardProductList: adminProtectedProcedure
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

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			const product = await db.product.findFirst({
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

			return product;
		}),

	update: adminProtectedProcedure
		.input(productSchema)
		.mutation(async ({ input }) => {
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

	remove: adminProtectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			return db.product.delete({
				where: {
					id: input.id,
				},
			});
		}),

	searchByName: adminProtectedProcedure
		.input(z.object({ query: z.string() }))
		.query(async ({ input }) => {
			if (input.query.length === 0) {
				return [];
			}
			const found = await db.product.findMany({
				where: {
					name: {
						contains: input.query,
						mode: "insensitive",
					},
				},
				include: {
					productMedia: true,
				},
			});

			console.log("trying to search: ", found);
			return found;
		}),

	getByIds: adminProtectedProcedure
		.input(
			z.object({
				ids: z.array(z.string()),
			}),
		)
		.query(async ({ input }) => {
			return db.product.findMany({
				where: {
					id: {
						in: input.ids,
					},
				},
				include: {
					productMedia: true,
				},
			});
		}),

	getProductsByCategory: publicProcedure
		.input(
			z.object({
				category: z.nativeEnum(ProductCategory).nullable(),
			}),
		)
		.query(async ({ input }) => {
			if (!input.category) {
				return [];
			}

			return db.product.findMany({
				where: {
					category: input.category,
				},
				include: {
					productMedia: true,
				},
			});
		}),
});
