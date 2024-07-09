"use client";

import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { type DefaultValues } from "react-hook-form";
import { revalidateGetProductCache } from "~/app/actions/actions";
import ProductFrom from "~/components/Dashboard/Product/Form";
import { type ProductSchema } from "~/lib/schemas/productSchema";
import { api } from "~/trpc/react";

interface UpdateProductFormProps {
	defaultValues: DefaultValues<ProductSchema>;
	id: string;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
	id,
	defaultValues,
}) => {
	const router = useRouter();
	const { mutateAsync } = api.product.update.useMutation({
		onSuccess: async () => {
			await revalidateGetProductCache(id);
			router.push(`/dashboard/product/`);
		},
	});

	async function onSubmit(data: ProductSchema) {
		void mutateAsync(data);
	}

	return <ProductFrom onSubmit={onSubmit} defaultValues={defaultValues} />;
};

export default UpdateProductForm;
