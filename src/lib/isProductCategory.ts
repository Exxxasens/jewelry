import { ProductCategory } from "@prisma/client";

export default function isProductCategory(c: string): c is ProductCategory {
	if (c in ProductCategory) {
		return true;
	}
	return false;
}
