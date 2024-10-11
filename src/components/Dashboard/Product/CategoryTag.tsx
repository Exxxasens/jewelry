import { type ProductCategory } from "@prisma/client";
import { categoriesMap } from "~/lib/options/categories";

interface CategoryTagProps {
	category: ProductCategory;
}

function getCategoryLabel(category: ProductCategory) {
	return categoriesMap[category];
}

const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
	return (
		<div className="tag border border-solid border-[#999999]">
			{getCategoryLabel(category)}
		</div>
	);
};

export default CategoryTag;
