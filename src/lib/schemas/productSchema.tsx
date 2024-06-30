import {
	Color,
	Material,
	MediaType,
	NumberOfStones,
	ProductCategory,
} from "@prisma/client";
import zod from "zod";
import InsertsEnum from "../avito/insertsEnum";

const productSchema = zod.object({
	sku: zod.string().min(1, "Артикул обязателен для заполнения"),
	name: zod.string().min(1, "Наименование обязательно для заполнения"),
	description: zod.string(),
	category: zod.nativeEnum(ProductCategory),

	// avito
	brand: zod.string(),
	color: zod.nativeEnum(Color),
	material: zod.nativeEnum(Material),
	probe: zod.string(),
	inserts: zod.array(zod.nativeEnum(InsertsEnum).or(zod.string())),
	stones: zod.nativeEnum(NumberOfStones),
	//

	media: zod.array(
		zod.object({
			order: zod.number(),
			loading: zod.boolean(),
			filename: zod.string(),
			type: zod.nativeEnum(MediaType),
			size: zod.number().optional(),
		}),
	), // any images

	price: zod.number(),
	oldPrice: zod.number(),
	weight: zod.number().optional(),
	size: zod.string().optional(),
});

export type ProductSchema = zod.infer<typeof productSchema>;

export default productSchema;
