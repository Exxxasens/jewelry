import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import exportAvitoSchema, {
	type ExportAvitoSchema,
} from "~/lib/schemas/exportAvitoSchema";
import SelectProductTable from "../../Product/Table/Select";

const resolver = zodResolver(exportAvitoSchema);

interface ExportAvitoFormProps {
	onSubmit: (data: ExportAvitoSchema) => void;
}

const ExportAvitoForm: React.FC<ExportAvitoFormProps> = ({ onSubmit }) => {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ExportAvitoSchema>({
		resolver,
	});

	return (
		<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col">
				<p className="card-heading label-optional">Наименование:</p>
				<input
					className="input-base"
					placeholder="Наименование"
					{...register("name")}
				/>
				{errors.name?.message && (
					<p className="error-container ml-1 mt-2 text-sm">
						{errors.name?.message}
					</p>
				)}
			</div>

			<div className="flex flex-col">
				<p className="card-heading label-required">Товары:</p>
				<div>
					<Controller
						control={control}
						name="products"
						render={({ field: { onChange } }) => (
							<SelectProductTable onChange={onChange} />
						)}
					/>
				</div>
				<div className="mt-4">
					<button className="button-base bg-indigo-600" type="submit">
						Создать
					</button>
				</div>
			</div>
		</form>
	);
};

export default ExportAvitoForm;
