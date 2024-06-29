import { Material } from "@prisma/client";

const productMaterialOptions = [
	{ value: Material.Gold, label: "Золото" },
	{ value: Material.Silver, label: "Серебро" },
	{ value: Material.Platinum, label: "Платина" },
	{ value: Material.JewelryAlloy, label: "Ювелирный сплав" },
	{ value: Material.Steel, label: "Сталь" },
	{ value: Material.Leather, label: "Кожа" },
	{ value: Material.PlatinumMetals, label: "Платиновые материалы" },
	{ value: Material.Other, label: "Другое" },
];

export default productMaterialOptions;
