import { type DefaultValues, useFieldArray, useForm } from "react-hook-form";
import { type CollectionSchema } from "~/lib/schemas/collectionSchema";

interface CollectionFormProps {
	defaultValues?: DefaultValues<CollectionSchema>;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ defaultValues }) => {
	const { register, control } = useForm<CollectionSchema>({
		defaultValues: {
			name: "",
			...defaultValues,
		},
	});

	const { fields } = useFieldArray({
		name: "products",
		control,
	});

	return (
		<div>
			{fields.map((item) => {
				return <div key={item.id}>{123}</div>;
			})}
		</div>
	);
};

export default CollectionForm;
