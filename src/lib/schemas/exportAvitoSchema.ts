import zod from "zod";

const exportAvitoSchema = zod.object({
	id: zod.string().optional(),
	name: zod.string().optional(),
	products: zod.array(
		zod.object({
			id: zod.string(),
		}),
	),
});

export type ExportAvitoSchema = zod.infer<typeof exportAvitoSchema>;

export default exportAvitoSchema;
