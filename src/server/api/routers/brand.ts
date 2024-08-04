import { adminProtectedProcedure, createTRPCRouter } from "~/server/api/trpc";

export const brandRouter = createTRPCRouter({
	fetchBrands: adminProtectedProcedure.query(({ ctx }) => {
		return ctx.db.brand.findMany();
	}),
});
