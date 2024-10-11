import { ProductCategory } from "@prisma/client";

export const categoriesMap: Record<ProductCategory, string> = {
	[ProductCategory.Rings]: "Кольца и перстни",
	[ProductCategory.Earrings]: "Серьги",
	[ProductCategory.Pendants]: "Кулоны и подвески",
	[ProductCategory.Bracelets]: "Браслеты",
	[ProductCategory.Piercing]: "Пирсинг",
	[ProductCategory.Chains]: "Цепи",
	[ProductCategory.Necklace]: "Колье",
	[ProductCategory.Charms]: "Шармы",
	[ProductCategory.Brooches]: "Броши",
	[ProductCategory.CompleteSet]: "Комплекты",
	[ProductCategory.Religious]: "Религиозные изделия",
	[ProductCategory.Anklets]: "Браслеты на ногу",
	[ProductCategory.Other]: "Другое",
};

export interface CategoriesOption {
	value: ProductCategory;
	label: string;
}

const categoriesOptions: CategoriesOption[] = Object.entries(categoriesMap).map(
	([value, label]) => ({
		value: value as ProductCategory,
		label: label,
	}),
) satisfies CategoriesOption[];

export default categoriesOptions;
