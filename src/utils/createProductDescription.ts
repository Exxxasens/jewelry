import type InsertsEnum from "~/lib/avito/insertsEnum";
import { getColorLabel } from "~/lib/productColorOptions";
import { InsertLabelsMap } from "~/lib/productInsertOptions";
import { productMaterialOptionsMap } from "~/lib/productMaterialOptions";
import { numOfStonesMap } from "~/lib/productNumOfStonesOptions";
import { type ProductsFromTask } from "~/server/api/routers/export";

function formatInsert(insert: string) {
	const hasOwnProperty = Object.hasOwn(InsertLabelsMap, insert);
	if (hasOwnProperty) {
		return InsertLabelsMap[insert as InsertsEnum];
	}
	return insert;
}

export default function createProductDescription(
	product: ArrayElement<ProductsFromTask>,
) {
	const { brandName, probe, weight, size, color, material, stones, inserts } =
		product;

	const details = [
		brandName ? `Бренд: ${brandName}` : "",
		material ? `Материал: ${productMaterialOptionsMap[material]}` : "",
		color ? `Цвет: ${getColorLabel(color)}` : "",
		probe ? `Проба: ${probe}` : "",
		inserts.length > 0
			? `Вставки: ${inserts.map((insert) => formatInsert(insert.type)).join(", ")}.`
			: "",
		stones ? `Кол-во камней: ${numOfStonesMap[stones]}` : "",
		size ? `Размер: ${size}` : "",
		weight ? `Вес: ${weight}` : "",
	];

	return `
		${product.description}\n
		${details.filter(Boolean).join("\n")}
	`;
}
