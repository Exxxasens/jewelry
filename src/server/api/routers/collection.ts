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
});
