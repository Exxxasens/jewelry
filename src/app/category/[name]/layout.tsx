import { ProductCategory } from "@prisma/client";
import { type PropsWithChildren } from "react";
import { categoriesMap } from "~/lib/productCategoriesOptions";

export interface CategoryParamsProps {
	params: {
		name: string;
	};
}

export function isCategoryName(name: string): name is ProductCategory {
	if (name in ProductCategory) {
		return true;
	}
	return false;
}
const CategoryLayout: React.FC<PropsWithChildren<CategoryParamsProps>> = ({
	params,
	children,
}) => {
	const { name } = params;

	if (!isCategoryName(name)) {
		return <div>Категория не найдена</div>;
	}

	return (
		<div className="mt-16 flex flex-col">
			<div className="flex justify-center">
				<h1 className="times-new-roman text-4xl font-light uppercase tracking-wider">
					{categoriesMap[name]}
				</h1>
			</div>
			<div className="flex flex-col">{children}</div>
		</div>
	);
};

export default CategoryLayout;
