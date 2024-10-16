"use client";

import { api } from "~/trpc/react";
import Table, { type TableColumns } from "../../Table";
import Image from "next/image";
import getMediaURL from "~/utils/getImageURL";
import CategoryTag from "../CategoryTag";
import { type ProductCategory, type ProductStatus } from "@prisma/client";
import Status from "../Status";
import { FiMoreHorizontal, FiPenTool, FiPlus, FiTrash } from "react-icons/fi";
import {
	type MenuItem,
	useContextMenuActions,
} from "~/components/ContextMenu/ContextMenuProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TableData {
	image?: string;
	name: string;
	sku: string;
	category: ProductCategory;
	status: ProductStatus;
	oldPrice: number | null;
	price: number;
}

const ProductTable = () => {
	const [getDashboardQueryParams] = useState({
		take: 10,
		skip: 0,
	});

	const router = useRouter();
	const utils = api.useUtils();

	const { mutateAsync } = api.product.remove.useMutation({
		async onMutate({ id }) {
			await utils.product.getDashboardProductList.cancel();
			const data = utils.product.getDashboardProductList.getData();
			utils.product.getDashboardProductList.setData(
				getDashboardQueryParams,
				(previousQuery) => {
					if (!previousQuery) {
						return;
					}
					return previousQuery.filter((data) => data.id !== id);
				},
			);
			return {
				data,
			};
		},
		onError(_err, _params, ctx) {
			if (ctx) {
				utils.product.getDashboardProductList.setData(
					getDashboardQueryParams,
					ctx.data,
				);
			}
		},
		onSettled() {
			void utils.product.getDashboardProductList.invalidate();
		},
	});

	const { data: products } = api.product.getDashboardProductList.useQuery(
		getDashboardQueryParams,
	);

	const { setContextMenu, showContextMenu, setPosition, hideContextMenu } =
		useContextMenuActions();
	const priceFormatter = new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: "RUB",
	});

	function openContextMenu(
		e: React.MouseEvent<HTMLButtonElement>,
		id: string,
	) {
		const { pageX, pageY } = e;
		const contextMenuItems: MenuItem[] = [
			{
				title: "Копировать",
				icon: <FiPlus />,
				handler() {
					router.push(`/dashboard/product/${id}/copy`);
					hideContextMenu();
				},
			},
			{
				title: "Редактировать",
				icon: <FiPenTool />,
				handler() {
					router.push(`/dashboard/product/${id}/edit`);
					hideContextMenu();
				},
			},
			{},
			{
				title: "Удалить",
				className: "delete",
				icon: <FiTrash />,
				handler() {
					void mutateAsync({
						id,
					});
					hideContextMenu();
				},
			},
		];
		setContextMenu(contextMenuItems);
		setPosition({ x: pageX, y: pageY });
		showContextMenu();
	}

	const columns: TableColumns<TableData> = {
		image: {
			title: "Фото",
			render: (image) => (
				<div className="flex h-24 w-full items-center justify-center bg-dark/5 p-3">
					<Image
						alt="img"
						src={getMediaURL(image)}
						width={96}
						height={96}
						className="h-full w-full rounded-sm bg-white object-contain"
					/>
				</div>
			),
			tdClassNames: "h-0 pt-3",
			thClassNames: "w-0 p-2 px-8 font-medium",
		},
		sku: {
			title: "Артикул",
			render: (sku) => (
				<div className="flex h-full items-center justify-center bg-dark/5 p-3 font-semibold">
					{sku}
				</div>
			),
			tdClassNames: "h-0 pt-3",
			thClassNames: "w-[10%] p-2",
		},
		name: {
			title: "Наименование",
			render: (name) => (
				<div className="flex h-full items-center justify-center bg-dark/5 p-3 text-base">
					{name}
				</div>
			),
			tdClassNames: "h-0 pt-3",
			thClassNames: "p-2",
		},
		category: {
			title: "Категория",
			render: (category) => (
				<div className="flex h-full flex-wrap items-center justify-center gap-2 bg-dark/5 p-3">
					<CategoryTag category={category} />
				</div>
			),
			tdClassNames: "h-0 max-w-lg pt-3 text-center",
			thClassNames: "p-2",
		},
		status: {
			title: "Статус",
			render: (status) => (
				<div className="flex h-full items-center justify-center bg-dark/5 p-3">
					<Status status={status} onClick={() => void null} />
				</div>
			),
			tdClassNames: "h-0 pt-3 text-center",
			thClassNames: "p-2",
		},
		oldPrice: {
			title: "Цена до скидки",
			render: (oldPrice) => (
				<div className="flex h-full items-center justify-center bg-dark/5 p-3">
					{oldPrice && priceFormatter.format(oldPrice)}
				</div>
			),
			tdClassNames: "h-0 pt-3 text-center",
			thClassNames: "p-2",
		},
		price: {
			title: "Цена",
			render: (price) => (
				<div className="flex h-full items-center justify-center bg-dark/5 p-3">
					{price && priceFormatter.format(price)}
				</div>
			),
			tdClassNames: "h-0 pt-3 text-center",
			thClassNames: "p-2",
		},
	};

	const dataSource = (products ?? []).map((product) => {
		const image = product.productMedia[0];
		return {
			key: product.id,
			image: image?.filename,
			name: product.name,
			sku: product.sku,
			category: product.category,
			status: product.status,
			oldPrice: product.oldPrice,
			price: product.price,
		};
	});

	return (
		<div className="flex flex-col">
			{dataSource && (
				<Table
					columns={columns}
					dataSource={dataSource}
					trClassNames="font-medium text-sm text-dark/80"
					thSelectClassNames="p-2"
					tdSelectClassNames="h-0 pt-3"
					selection={(onChange, checked, heading) => (
						<div
							className={`flex h-full items-center justify-center ${
								heading ? "" : "rounded-l-md bg-dark/5 p-3"
							}`}
						>
							<input
								type="checkbox"
								checked={checked}
								onChange={onChange}
								className="h-4 w-4"
							/>
						</div>
					)}
					menu={(key) => (
						<div className="flex h-full items-center justify-center rounded-r-md bg-dark/5 p-3">
							<button
								className="button-sm"
								type="button"
								onClick={(e) => openContextMenu(e, key)}
							>
								<FiMoreHorizontal className="text-xl" />
							</button>
						</div>
					)}
					tdMenuClassNames="h-0 pt-3"
				/>
			)}

			{/* <table cellPadding={0} cellSpacing={0}>
				<thead>
					<tr className="text-sm text-dark/80">
						<th className="w-0 p-2 px-8 font-medium">Фото</th>
						<th className="w-[10%] p-2 font-medium">Артикул</th>
						<th className="p-2 font-medium">Наименование</th>
						<th className="p-2 font-medium">Категория</th>
						<th className="p-2 font-medium">Статус</th>
						<th className="p-2 font-medium">На складе</th>
						<th className="p-2 font-medium">Цена до скидки</th>
						<th className="p-2 font-medium">Цена продажи</th>
						<th className="p-2 font-medium">Действие</th>
					</tr>
				</thead>
				<tbody>
					{products?.map((product) => (
						<Row key={product.id} product={product} />
					))}
				</tbody>
			</table> */}
		</div>
	);
};

export default ProductTable;
