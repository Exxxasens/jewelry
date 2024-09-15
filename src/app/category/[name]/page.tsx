"use client";

import { api } from "~/trpc/react";
import { isCategoryName, type CategoryParamsProps } from "./layout";
import Image from "next/image";
import getMediaURL from "~/utils/getImageURL";
import Link from "next/link";
import priceFormatter from "~/lib/priceFormatter";

const CategoryPage: React.FC<CategoryParamsProps> = ({ params }) => {
	const { data } = api.product.getProductsByCategory.useQuery(
		{
			category: isCategoryName(params.name) ? params.name : null,
		},
		{ enabled: isCategoryName(params.name) },
	);

	return (
		<div className="mt-8 flex flex-col px-8">
			<div className="flex flex-col items-center text-sm text-dark/75">
				Количество изделий: {data?.length}
			</div>

			<div className="mt-16 flex flex-row">
				{data?.map((item) => {
					return (
						<Link
							key={item.id}
							className="h-[30rem] w-[30rem]"
							href={`/products/${item.id}`}
						>
							<Image
								width={640}
								height={640}
								src={getMediaURL(
									item.productMedia[0]?.filename,
								)}
								alt={""}
							/>
							<div className="mt-2 text-center text-base text-dark">
								{item.name}
							</div>
							<div className="mt-1 text-center text-dark/80">
								{item.price &&
									priceFormatter.format(item.price)}
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default CategoryPage;
