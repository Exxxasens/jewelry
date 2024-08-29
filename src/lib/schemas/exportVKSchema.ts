import zod from "zod";

const exportVKSchema = zod.object({
	id: zod.string().optional(),
	group: zod.number({
		required_error: "Сообщество для экспорта не выбрано",
	}),
	name: zod.string().optional(),
	products: zod.array(
		zod.object({
			id: zod.string(),
		}),
	),
});

export type ExportVKSchema = zod.infer<typeof exportVKSchema>;

export default exportVKSchema;
