"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function CollectionPage() {
	const utils = api.useUtils();
	const [getAllQueryInput, setGetAllQueryInput] = useState({
		take: 10,
		skip: 0,
	});

	const { data: collections, isLoading } =
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
					className="button-base bg-dark"
					onClick={() => addCollection("Новая подборка")}
				>
					Добавить подборку
				</button>
			</div>
			<div className="mb-8 mt-8 text-2xl font-bold text-dark">Все</div>
			<div className="flex flex-col gap-4">
				{collections?.map(({ id, name }) => {
					return (
						<div className="rounded-md bg-[#F2F1F0] p-4" key={id}>
							<div className="text-base">{name}</div>
							<div>{}</div>
						</div>
					);
				})}
			</div>
		</main>
	);
}
