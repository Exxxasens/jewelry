import { Material } from "@prisma/client";

export interface MaterialOption {
	value: Material;
	label: string;
}
export type MaterialOptionMap = Record<Material, string>;

export const materialOptionsMap = {
	[Material.Gold]: "Золото",
	[Material.Silver]: "Серебро",
	[Material.Platinum]: "Платина",
	[Material.JewelryAlloy]: "Ювелирный сплав",
	[Material.Steel]: "Сталь",
	[Material.Leather]: "Кожа",
	[Material.PlatinumMetals]: "Платиновые материалы",
	[Material.Other]: "Другое",
	[Material.IonSpraying]: "Ионное напыление",
} satisfies MaterialOptionMap;

const materialOptions: MaterialOption[] = Object.entries(
	materialOptionsMap,
).map(([value, label]) => ({
	value: value as Material,
	label: label,
}));

export default materialOptions;
