"use client";

import ProductFrom from "~/components/Dashboard/Product/Form";
import { type ProductSchema } from "~/lib/schemas/productSchema";
import { api } from "~/trpc/react";

// TODO: refactor page...

const CreateProductPage = () => {
	const { mutateAsync } = api.product.create.useMutation();

	function onSubmit(data: ProductSchema) {
		mutateAsync(data)
			.then((data) => {
				console.log("submitted", data);
			})
			.catch((error) => console.log(error));
	}

	return (
		<div className="flex flex-col pb-8">
			<h2 className="mb-8 text-2xl font-bold text-dark">Новый товар</h2>
			<ProductFrom onSubmit={onSubmit} />
		</div>
	);
};

export default CreateProductPage;
