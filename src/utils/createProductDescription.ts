import type InsertsEnum from "~/lib/avito/insertsEnum";
import { getColorLabel } from "~/lib/options/color";
import { insertLabelsMap } from "~/lib/options/inserts";
import { productMaterialOptionsMap } from "~/lib/options/material";
import { numOfStonesMap } from "~/lib/options/numOfStones";
import { type ProductsFromTask } from "~/server/api/routers/export";

function formatInsert(insert: string) {
	const hasOwnProperty = Object.hasOwn(insertLabelsMap, insert);
	if (hasOwnProperty) {
		return insertLabelsMap[insert as InsertsEnum];
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
