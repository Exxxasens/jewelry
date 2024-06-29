import {
	Color,
	Inserts,
	Material,
	NumberOfStones,
	ProductCategory,
} from "@prisma/client";
import zod from "zod";

const productSchema = zod.object({
	sku: zod.string().min(1, "Артикул обязателен для заполнения"),
	name: zod.string().min(1, "Наименование обязательно для заполнения"),
	description: zod.string(),
	category: zod.nativeEnum(ProductCategory),

	// avito
	brand: zod.string(),
	color: zod.nativeEnum(Color),
	material: zod.nativeEnum(Material),
	inserts: zod.array(zod.nativeEnum(Inserts)),
	stones: zod.nativeEnum(NumberOfStones),
	//

	media: zod.array(
		zod.object({
			order: zod.number(),
			isLoading: zod.boolean(),
			filename: zod.string().nullable(),
			type: zod.enum(["photo", "video"]),
			size: zod.number().optional(),
		}),
	), // any images

	price: zod.number(),
	oldPrice: zod.number(),
	weight: zod.number(),
	size: zod.string(),
});

export type ProductSchema = zod.infer<typeof productSchema>;

export default productSchema;
