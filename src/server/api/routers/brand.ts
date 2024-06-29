import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const brandRouter = createTRPCRouter({
	fetchBrands: publicProcedure.query(({ ctx }) => {
		return ctx.db.brand.findMany();
	}),
});
