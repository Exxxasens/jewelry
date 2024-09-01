import { ProductCategory } from "@prisma/client";

export default function transformCategory(category: ProductCategory) {
	if (category === ProductCategory.Bracelets) {
		return 50062; // Браслеты
	}
	if (category === ProductCategory.Brooches) {
		return 50053; // Броши, значки и пины
	}
	if (category === ProductCategory.Chains) {
		return 50057; // Цепи и подвески
	}
	if (category === ProductCategory.Charms) {
		return 50354; // Шармы
	}
	if (category === ProductCategory.CompleteSet) {
		return 50067; // Комплекты украшений
	}
	if (category === ProductCategory.Earrings) {
		return 50056; // Серьги
	}
	if (category === ProductCategory.Necklace) {
		return 50063;
	}
	if (category === ProductCategory.Other) {
		return 40064; // Ювелирные украшения
	}
	if (category === ProductCategory.Pendants) {
		return 40064; // Ювелирные украшения
	}
	if (category === ProductCategory.Piercing) {
		return 50068;
	}
	if (category === ProductCategory.Religious) {
		return 40064; // Ювелирные украшения
	}
	if (category === ProductCategory.Rings) {
		return 50101;
	}
	return 40064;
}