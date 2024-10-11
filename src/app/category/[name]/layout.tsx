import { type PropsWithChildren } from "react";
import isProductCategory from "~/lib/isProductCategory";
import { categoriesMap } from "~/lib/options/categories";

export interface CategoryParamsProps {
	params: {
		name: string;
	};
}

const CategoryLayout: React.FC<PropsWithChildren<CategoryParamsProps>> = ({
	params,
	children,
}) => {
	const { name } = params;

	if (!isProductCategory(name)) {
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
