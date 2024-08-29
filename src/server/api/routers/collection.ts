import { adminProtectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import z from "zod";
import { db } from "~/server/db";

export const collectionRouter = createTRPCRouter({
	getAll: adminProtectedProcedure
		.input(
			z.object({
				skip: z.number().min(0),
				take: z.number().min(1).max(10),
			}),
		)
		.query(async ({ input }) => {
			return db.collection.findMany({
				where: {},
				orderBy: {
					createdAt: {
						sort: "asc",
						nulls: "last",
					},
				},
				include: {
					products: {
						select: {
							id: true,
						},
					},
				},
				take: input.take,
				skip: input.skip,
			});
		}),

	create: adminProtectedProcedure
		.input(
			z.object({
				name: z.string(),
				products: z.array(z.string()),
			}),
		)
		.mutation(async ({ input }) => {
			return db.collection.create({
				data: {
					name: input.name,
					products: {
						connect: input.products.map((product) => ({
							id: product,
						})),
					},
				},
			});
		}),

	updateProductsList: adminProtectedProcedure
		.input(
			z.object({
				id: z.string(),
				products: z.array(z.string()),
			}),
		)
		.mutation(async ({ input }) => {
			return db.collection.update({
				where: {
					id: input.id,
				},
				data: {
					products: {
						set: input.products.map((id) => ({
							id,
						})),
					},
				},
			});
		}),

	updateName: adminProtectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			return db.collection.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
				},
			});
		}),
});
