import zod from "zod";

const collectionSchema = zod.object({
	id: zod.string().optional(),
	name: zod.string(),
	products: zod.array(
		zod.object({
			id: zod.string(),
		}),
	),
});

export type CollectionSchema = zod.infer<typeof collectionSchema>;

export default collectionSchema;
