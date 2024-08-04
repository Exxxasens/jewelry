"use client";
import { useRouter } from "next/navigation";
import { type DefaultValues } from "react-hook-form";
import { revalidateGetProductCache } from "~/app/actions/actions";
import ProductFrom from "~/components/Dashboard/Product/Form";
import { type ProductSchema } from "~/lib/schemas/productSchema";
import { api } from "~/trpc/react";

interface CopyProductFormProps {
	defaultValues: DefaultValues<ProductSchema>;
	id: string;
}

const CopyProductForm: React.FC<CopyProductFormProps> = ({
	id,
	defaultValues,
}) => {
	const router = useRouter();
	const { mutateAsync } = api.product.create.useMutation({
		onSuccess: async () => {
			await revalidateGetProductCache(id);
			router.push(`/dashboard/product/`);
		},
	});

	async function onSubmit(data: ProductSchema) {
		void mutateAsync(data);
	}

	return (
		<ProductFrom
			buttonValue="Создать"
			onSubmit={onSubmit}
			defaultValues={defaultValues}
		/>
	);
};

export default CopyProductForm;
