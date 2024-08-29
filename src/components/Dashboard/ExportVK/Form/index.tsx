"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type Control,
	Controller,
	FormProvider,
	useForm,
} from "react-hook-form";
import exportVKSchema, {
	type ExportVKSchema,
} from "~/lib/schemas/exportVKSchema";
import SelectProductTable from "../../Product/Table/Select";
import { api } from "~/trpc/react";
import Select from "react-select";

interface GroupSelectProps {
	control: Control<ExportVKSchema>;
}

const GroupSelect: React.FC<GroupSelectProps> = ({ control }) => {
	const { data, isLoading } = api.export.getUserGroups.useQuery();

	return (
		<Controller
			control={control}
			name="group"
			render={({ field: { onBlur, onChange } }) => (
				<Select
					isMulti={false}
					isLoading={isLoading}
					options={data?.items.map((element) => ({
						label: element.name,
						value: element.id,
					}))}
					placeholder="Сообщество"
					onBlur={onBlur}
					onChange={(data) => onChange(data?.value)}
				/>
			)}
		/>
	);
};

const resolver = zodResolver(exportVKSchema);

interface ExportVKFormProps {
	onSubmit: (data: ExportVKSchema) => void;
}

const ExportVKForm: React.FC<ExportVKFormProps> = ({ onSubmit }) => {
	const methods = useForm<ExportVKSchema>({
		resolver,
	});

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = methods;

	console.log(errors);

	return (
		<FormProvider {...methods}>
			<form
				className="flex flex-col gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col">
					<p className="card-heading label-required">Группа:</p>
					<GroupSelect control={control} />
				</div>

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
						<SelectProductTable />
					</div>
					<div className="mt-4">
						<button
							className="button-base bg-indigo-600"
							type="submit"
						>
							Создать
						</button>
					</div>
				</div>
			</form>
		</FormProvider>
	);
};

export default ExportVKForm;
