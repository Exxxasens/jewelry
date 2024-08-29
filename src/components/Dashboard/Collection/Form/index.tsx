"use client";

import {
	type DefaultValues,
	FormProvider,
	useFieldArray,
	useForm,
	useFormContext,
} from "react-hook-form";
import { FiCheck, FiX } from "react-icons/fi";
import { type CollectionSchema } from "~/lib/schemas/collectionSchema";
import CollectionProductCard from "./ProductCard";
import EmptyCard from "./CollectionProductForm";
import CollectionProductForm from "./CollectionProductForm";
import { api } from "~/trpc/react";

const CollectionName = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<CollectionSchema>();

	return (
		<div className="mr-2 flex h-auto flex-col">
			<input
				className="input-base h-full px-2 py-1 text-base font-medium"
				{...register("name")}
			/>
			{errors.name?.message && (
				<div className="error-container text-xs">
					{errors.name?.message}
				</div>
			)}
		</div>
	);
};

const CollectionProductList = () => {
	const { control } = useFormContext<CollectionSchema>();
	const { fields } = useFieldArray({
		name: "products",
		control,
	});

	return (
		<div className="flex flex-col">
			<div className="mt-4 font-normal text-dark/90">Товары:</div>
			<div className="mt-2 flex gap-2">
				{fields.map(({ id, productId }) => {
					return <CollectionProductCard key={id} id={productId} />;
				})}
				<CollectionProductForm
					products={fields.map(({ productId }) => productId)}
				/>
			</div>
		</div>
	);
};

interface CollectionFormProps {
	defaultValues?: DefaultValues<CollectionSchema>;
	onFormSubmit: () => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({
	defaultValues,
	onFormSubmit,
}) => {
	const utils = api.useUtils();
	const methods = useForm<CollectionSchema>({
		defaultValues: {
			name: "",
			...defaultValues,
		},
	});

	const { mutateAsync } = api.collection.updateName.useMutation();

	function onLabelFormSubmit(data: CollectionSchema) {
		if (!data.id) {
			return;
		}
		void mutateAsync({
			id: data.id,
			name: data.name,
		});
		onFormSubmit();
		utils.collection.getAll.invalidate();
	}

	function onEditEnd() {
		console.log("end edit");
	}

	return (
		<FormProvider {...methods}>
			<form
				className="flex h-full w-full flex-col"
				onSubmit={methods.handleSubmit(onLabelFormSubmit)}
			>
				<div className="flex w-full flex-row">
					<CollectionName />
					<div className="flex items-center justify-center gap-2">
						<button
							className="button-sm hover:indigo-500 px-2 text-base text-indigo-500"
							type="submit"
						>
							<FiCheck />
						</button>
						<button
							className="button-sm hover:indigo-500 text-red px-2 text-base"
							type="button"
							onClick={onEditEnd}
						>
							<FiX />
						</button>
					</div>
				</div>
				<CollectionProductList />
			</form>
		</FormProvider>
	);
};

export default CollectionForm;
