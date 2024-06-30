import { ProductCategory } from "@prisma/client";

export interface CategoriesOption {
	value: ProductCategory;
	label: string;
}

const productCategoriesOptions = [
	{ value: ProductCategory.Rings, label: "Кольца и перстни" },
	{ value: ProductCategory.Earrings, label: "Серьги" },
	{ value: ProductCategory.Pendants, label: "Кулоны и подвески" },
	{ value: ProductCategory.Bracelets, label: "Браслеты" },
	{ value: ProductCategory.Piercing, label: "Пирсинг" },
	{ value: ProductCategory.Chains, label: "Цепи" },
	{ value: ProductCategory.Necklace, label: "Колье" },
	{ value: ProductCategory.Charms, label: "Шармы" },
	{ value: ProductCategory.Brooches, label: "Броши" },
	{ value: ProductCategory.CompleteSet, label: "Комплекты" },
	{ value: ProductCategory.Religious, label: "Религиозные изделия" },
	{ value: ProductCategory.Other, label: "Другое" },
] satisfies CategoriesOption[];

export default productCategoriesOptions;
