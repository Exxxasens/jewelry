import Image from "next/image";
import { useEffect, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import getMediaURL from "~/utils/getImageURL";
import CategoryTag from "../CategoryTag";
import Status from "../Status";
import { produce } from "immer";
import { useFormContext } from "react-hook-form";
import { type ExportVKSchema } from "~/lib/schemas/exportVKSchema";

const SelectProductTable = () => {
	const { setValue } = useFormContext<ExportVKSchema>();

	const [isAllSelected, setIsAllSelected] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [getDashboardQueryParams, setDashboardQueryParams] = useState({
		take: 10,
		skip: 0,
	});

	const { data: products } = api.product.getDashboardProductList.useQuery(
		getDashboardQueryParams,
	);

	useEffect(() => {
		if (!products) {
			return setIsAllSelected(false);
		}
		for (const product of products) {
			if (!selectedProducts.find((selected) => selected === product.id)) {
				return setIsAllSelected(false);
			}
		}
		return setIsAllSelected(true);
	}, [products, selectedProducts]);

	function toggleSelect(id: string) {
		setSelectedProducts(
			produce((draft) => {
				const productId = draft.find((item) => item === id);
				if (productId) {
					return draft.filter((item) => item !== productId);
				}
				draft.push(id);
				return draft;
			}),
		);
	}

	function toggleAll(ids: string[], state: boolean) {
		// setDataList(
		// 	produce((draft) => {
		// 		draft.forEach((item) => (item._selected = selected));
		// 		return draft;
		// 	}),
		// );

		setSelectedProducts(
			produce((draft) => {
				const filtered = draft.filter((p) => !ids.includes(p));
				if (state) {
					return filtered.concat(ids);
				}

				return filtered;
			}),
		);
	}

	useEffect(() => {
		return setValue(
			"products",
			selectedProducts.map((selected) => ({ id: selected })),
		);
	}, [selectedProducts, setValue]);

	const priceFormatter = new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: "RUB",
	});

	return (
		<div className="flex flex-col">
			<table cellPadding={0} cellSpacing={0}>
				<thead>
					<tr className="text-sm font-medium text-dark/80">
						<td className="p-2">
							<div className="flex h-full items-center justify-center">
								{products && (
									<input
										type="checkbox"
										checked={isAllSelected}
										onChange={() =>
											toggleAll(
												products.map((p) => p.id),
												!isAllSelected,
											)
										}
										className="h-4 w-4"
									/>
								)}
							</div>
						</td>
						<th className="w-0 p-2 px-8 font-medium">Фото</th>
						<th className="w-[10%] p-2">Артикул</th>
						<th className="p-2">Наименование</th>
						<th className="p-2">Категория</th>
						<th className="p-2">Статус</th>
						<th className="p-2">Цена до скидки</th>
						<th className="p-2">Цена</th>
					</tr>
				</thead>
				<tbody>
					{products?.map((product) => {
						const image = product.productMedia[0]?.filename;

						const {
							id,
							sku,
							name,
							category,
							status,
							oldPrice,
							price,
						} = product;
						const checked = !!selectedProducts.find(
							(selected) => selected === id,
						);
						return (
							<tr key={id}>
								<td className="h-0 pt-3">
									<div className="flex h-full items-center justify-center rounded-l-md bg-dark/5 p-3">
										<input
											type="checkbox"
											checked={checked}
											onChange={() => toggleSelect(id)}
											className="h-4 w-4"
										/>
									</div>
								</td>
								<td className="h-0 pt-3">
									<div className="flex h-24 w-full items-center justify-center bg-dark/5 p-3">
										<Image
											alt="img"
											src={getMediaURL(image)}
											width={96}
											height={96}
											className="h-full w-full rounded-sm bg-white object-contain"
										/>
									</div>
								</td>
								<td className="h-0 pt-3">
									<div className="flex h-full items-center justify-center bg-dark/5 p-3 font-semibold">
										{sku}
									</div>
								</td>
								<td className="h-0 pt-3">
									<div className="flex h-full items-center justify-center bg-dark/5 p-3 text-base">
										{name}
									</div>
								</td>
								<td className="h-0 max-w-lg pt-3 text-center">
									<div className="flex h-full flex-wrap items-center justify-center gap-2 bg-dark/5 p-3">
										<CategoryTag category={category} />
									</div>
								</td>
								<td className="h-0 pt-3 text-center">
									<div className="flex h-full items-center justify-center bg-dark/5 p-3">
										<Status
											status={status}
											onClick={() => void null}
										/>
									</div>
								</td>
								<td className="h-0 pt-3 text-center">
									<div className="flex h-full items-center justify-center bg-dark/5 p-3">
										{oldPrice &&
											priceFormatter.format(oldPrice)}
									</div>
								</td>
								<td className="h-0 pt-3 text-center">
									<div className="flex h-full items-center justify-center bg-dark/5 p-3">
										{price && priceFormatter.format(price)}
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default SelectProductTable;
