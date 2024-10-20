import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { productRouter } from "./routers/product";
import { brandRouter } from "./routers/brand";
import { collectionRouter } from "./routers/collection";
import { exportRouter } from "./routers/export";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	product: productRouter,
	brand: brandRouter,
	collection: collectionRouter,
	export: exportRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
