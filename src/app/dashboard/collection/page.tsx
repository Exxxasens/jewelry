"use client";

import { useState } from "react";
import CollectionItem from "~/components/Dashboard/Collection/Item";
import { api } from "~/trpc/react";

export default function CollectionPage() {
	const utils = api.useUtils();
	const [getAllQueryInput] = useState({
		take: 10,
		skip: 0,
	});

	const { data: collections } =
		api.collection.getAll.useQuery(getAllQueryInput);

	const { mutateAsync } = api.collection.create.useMutation({
		onSettled: () => {
			void utils.collection.getAll.invalidate(getAllQueryInput);
		},
	});

	function addCollection(name: string, products: string[] = []) {
		void mutateAsync({ name, products });
	}

	return (
		<main className="">
			<div>
				<button
					className="button-base bg-indigo-600"
					onClick={() => addCollection("Новая подборка")}
				>
					Добавить подборку
				</button>
			</div>
			<div className="mb-8 mt-8 text-2xl font-bold text-dark">Все</div>
			<div className="flex flex-col gap-4">
				{collections?.map(({ id, name, products }) => (
					<CollectionItem
						key={id}
						id={id}
						name={name}
						products={products}
					/>
				))}
			</div>
		</main>
	);
}
