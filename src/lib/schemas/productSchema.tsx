import {
	Color,
	Material,
	MediaType,
	NumberOfStones,
	ProductCategory,
} from "@prisma/client";
import zod from "zod";
import InsertsEnum from "../avito/insertsEnum";

const productSchema = zod
	.object({
		sku: zod.string().min(1, "Артикул обязателен для заполнения"),
		name: zod.string().min(1, "Наименование обязательно для заполнения"),
		description: zod.string().min(1, "Описание обязательно для заполнения"),
		category: zod.nativeEnum(ProductCategory, {
			required_error: "Категория обязательна для заполения",
		}),

		// avito
		brand: zod.string().optional(),
		color: zod.nativeEnum(Color).optional(),
		material: zod.nativeEnum(Material).optional(),
		probe: zod.string().optional(),
		inserts: zod.array(zod.nativeEnum(InsertsEnum).or(zod.string())),
		stones: zod.nativeEnum(NumberOfStones).optional(),
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

		price: zod.number().min(0, "Цена не может быть меньше 0"),
		oldPrice: zod.number().min(0, "Цена до скидки не может быть меньше 0"),
		weight: zod.number().optional(),
		size: zod.string().optional(),
	})
	.refine((schema) => schema.oldPrice > schema.price, {
		message: "Цена до скидки не может быть меньше",
		path: ["oldPrice"],
	});

export type ProductSchema = zod.infer<typeof productSchema>;

export default productSchema;
