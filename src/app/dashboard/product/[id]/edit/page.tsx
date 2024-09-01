"use server";

import { notFound } from "next/navigation";
import { type DefaultValues } from "react-hook-form";
import { type ProductSchema } from "~/lib/schemas/productSchema";
import { api } from "~/trpc/server";
import UpdateProductForm from "./UpdateProductForm";

interface EditProductPageProps {
	params: {
		id: string;
	};
}

const EditProductPage: React.FC<EditProductPageProps> = async ({ params }) => {
	const product = await api.product.getById({ id: params.id });
	if (!product) {
		return notFound();
	}

	const defaultValues: DefaultValues<ProductSchema> = {
		id: params.id,
		sku: product.sku,
		name: product.name,
		description: product.description ?? "",
		category: product.category,

		// avito
		brand: product.brandName ?? undefined,
		color: product.color ?? undefined,
		material: product.material ?? undefined,
		probe: product.probe ?? undefined,
		inserts: product.inserts.map((insert) => insert.type),
		stones: product.stones ?? undefined,
		//

		media: product.productMedia.map(({ order, media }) => ({
			order: order,
			loading: false,
			filename: media.filename,
			type: media.type,
			size: undefined,
		})),

		price: product.price,
		oldPrice: product.oldPrice ?? undefined,
		weight: product.weight ?? undefined,
		size: product.size ?? undefined,
	};

	return (
		<div className="flex flex-col pb-4">
			<div className="heading-2xl">Редактирование товара</div>
			<UpdateProductForm id={params.id} defaultValues={defaultValues} />
		</div>
	);
};

export default EditProductPage;
