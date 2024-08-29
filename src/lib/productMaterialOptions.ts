import { Material } from "@prisma/client";

export interface MaterialOption {
	value: Material;
	label: string;
}

export const productMaterialOptionsMap = {
	[Material.Gold]: "Золото",
	[Material.Silver]: "Серебро",
	[Material.Platinum]: "Платина",
	[Material.JewelryAlloy]: "Ювелирный сплав",
	[Material.Steel]: "Сталь",
	[Material.Leather]: "Кожа",
	[Material.PlatinumMetals]: "Платиновые материалы",
	[Material.Other]: "Другое",
} as const;

const productMaterialOptions: MaterialOption[] = Object.entries(
	productMaterialOptionsMap,
).map(([value, label]) => ({
	value: value as Material,
	label: label as string,
}));

export default productMaterialOptions;
