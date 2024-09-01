"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { PiMagnifyingGlass } from "react-icons/pi";
import { usePopup } from "~/components/Popup/PopupContext";
import { api, type RouterOutputs } from "~/trpc/react";
import getMediaURL from "~/utils/getImageURL";
import Image from "next/image";
import useDebounce from "~/components/hooks/useDebounce";
import { produce } from "immer";
import { useFormContext } from "react-hook-form";
import { type CollectionSchema } from "~/lib/schemas/collectionSchema";

interface ProductSelectItemProps {
	product: ArrayElement<RouterOutputs["product"]["searchByName"]>;
	isChecked: boolean;
	onChange: (id: string) => void;
}

const ProductSelectItem: React.FC<ProductSelectItemProps> = ({
	product,
	isChecked,
	onChange,
}) => {
	const image = product.productMedia.sort((a, b) => a.order - b.order)[0];

	return (
		<div className="flex flex-row rounded-md bg-[#F2F1F0] p-2">
			<div className="mr-2">
				{image && (
					<Image
						alt="img"
						src={getMediaURL(image.filename)}
						width={80}
						height={80}
						className="h-full w-full rounded-sm object-contain"
					/>
				)}
			</div>

			<div className="mr-4 flex w-full flex-col justify-center">
				<div className="text-dark/90">{product.name}</div>
				<div className="mt-1 text-dark/80">арт. {product.sku}</div>
			</div>

			<div className="flex flex-col justify-center px-2">
				<input
					className="h-4 w-4"
					type="checkbox"
					checked={isChecked}
					onChange={() => onChange(product.id)}
				/>
			</div>
		</div>
	);
};

interface CollectionProductSelectProps {
	products: string[];
	onUpdate: (selectedItems: string[]) => void;
}

const CollectionProductSelect: React.FC<CollectionProductSelectProps> = ({
	products = [],
	onUpdate,
}) => {
	const [selectedItems, setSelectedItems] = useState<string[]>(products);
	const [searchText, setSearchText] = useState<string>("");
	const query = useDebounce(searchText, 500);

	const { data: searchProducts } = api.product.searchByName.useQuery({
		query,
	});

	const { data: selectedProducts } = api.product.getByIds.useQuery({
		ids: selectedItems,
	});

	function update() {
		onUpdate(selectedItems);
	}

	function handleCheckbox(id: string) {
		setSelectedItems(
			produce((draft) => {
				const foundIndex = draft.findIndex((product) => product === id);
				if (foundIndex >= 0) {
					draft = draft.filter((product) => product !== id);
					return draft;
				}
				draft.push(id);
				return draft;
			}),
		);
	}

	const displayedProducts =
		searchText.length === 0 ? selectedProducts : searchProducts;

	const isShowSearch = searchText && searchText.length > 0;
	const selectedListIsEmpty = selectedProducts?.length === 0;

	return (
		<div className="w-screen max-w-sm">
			<div className="mb-2 text-lg font-bold">Состав подборки</div>
			<div className="relative flex flex-col">
				<p className="card-heading">Поиск:</p>
				<div className="relative flex w-full items-center">
					<div className="pointer-events-none absolute left-0 line-clamp-none flex h-full items-center px-3 text-[#999999]">
						<PiMagnifyingGlass className="text-lg" />
					</div>
					<input
						className="input-base h-full w-full pl-9 text-base font-medium text-dark/80"
						placeholder="Введите наименование"
						type="text"
						value={searchText}
						onChange={(event) => setSearchText(event.target.value)}
					/>
				</div>
				{/* {showMenu && (
					<div className="absolute top-[100%] z-10 mt-4 flex flex-col gap-2 rounded-md border-dark/10 bg-[#F2F1F0] shadow-lg">
						{searchProducts?.map((product) => {
							const isChecked = !!selectedItems.find(
								(item) => item === product.id,
							);

							return (
								<ProductSelectItem
									key={product.id}
									product={product}
									isChecked={isChecked}
									onChange={() => handleCheckbox(product.id)}
								/>
							);
						})}
					</div>
				)} */}
			</div>
			{displayedProducts && (
				<div className="flex flex-col">
					<div className="mt-4 flex flex-col">
						{isShowSearch && (
							<div className="font-normal text-dark/80">
								{searchProducts?.length === 0
									? "Ничего не найдено"
									: "Найдено:"}
							</div>
						)}
						{!isShowSearch && !selectedListIsEmpty && (
							<div className="font-normal text-dark/80">
								Добавлено в подборку:
							</div>
						)}
						{!isShowSearch && selectedListIsEmpty && (
							<div className="font-normal text-dark/80">
								Ничего не добавлено в подборку
							</div>
						)}
					</div>
					{displayedProducts.length > 0 && (
						<div className="mt-2 flex max-h-[360px] flex-col gap-2 overflow-auto">
							{displayedProducts.map((data) => {
								const isChecked = !!selectedItems.find(
									(item) => item === data.id,
								);
								return (
									<ProductSelectItem
										key={data.id}
										product={data}
										isChecked={isChecked}
										onChange={handleCheckbox}
									/>
								);
							})}
						</div>
					)}
				</div>
			)}
			<div className="mt-4 flex flex-col items-center justify-center">
				<button
					className="button-base w-full bg-indigo-600"
					onClick={update}
				>
					Сохранить
				</button>
			</div>
		</div>
	);
};

interface EmptyCardProps {
	products: string[];
}

const CollectionProductForm: React.FC<EmptyCardProps> = ({ products }) => {
	const { watch, setValue } = useFormContext<CollectionSchema>();

	const id = watch("id");

	const { openPopup, closePopup } = usePopup();
	const { mutateAsync } = api.collection.updateProductsList.useMutation();

	function update(selectedItems: string[]) {
		if (!id) {
			return;
		}
		// onListUpdate(selectedItems);
		void mutateAsync({
			id,
			products: selectedItems,
		});
		setValue(
			"products",
			selectedItems.map((productId) => ({ productId })),
		);
		closePopup();
	}

	function onAdd() {
		openPopup(
			<CollectionProductSelect onUpdate={update} products={products} />,
		);
	}

	return (
		<div
			className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-[#F2F1F0] text-xl text-indigo-600"
			onClick={onAdd}
		>
			<FiPlus />
		</div>
	);
};

export default CollectionProductForm;
