"use client";

import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import CollectionForm from "./Form";
import { type DefaultValues } from "react-hook-form";
import { type CollectionSchema } from "~/lib/schemas/collectionSchema";

interface CollectionItemProps {
	id: string;
	name: string;
	products: {
		id: string;
	}[];
}

const CollectionItem: React.FC<CollectionItemProps> = ({
	id,
	name,
	products,
}) => {
	const [editable, setEditable] = useState(false);

	const defaultValues: DefaultValues<CollectionSchema> = {
		id,
		name,
		products: products.map((item) => ({
			productId: item.id,
		})),
	};

	return (
		<div className="rounded-md border border-solid border-dark/10 bg-white p-4">
			{!editable && (
				<div className="flex flex-row items-center gap-2">
					<div className="mr-auto text-base">{name}</div>
					<button
						className="button-sm bg-white text-base hover:text-white"
						onClick={() => setEditable(true)}
					>
						<FiEdit3 />
					</button>
				</div>
			)}
			{editable && (
				<CollectionForm
					onFormSubmit={() => setEditable(false)}
					defaultValues={defaultValues}
				/>
			)}
		</div>
	);
};

export default CollectionItem;
