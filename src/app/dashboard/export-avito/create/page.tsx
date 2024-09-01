"use client";

import ExportAvitoForm from "~/components/Dashboard/ExportAvito/Form";
import { type ExportAvitoSchema } from "~/lib/schemas/exportAvitoSchema";
import { api } from "~/trpc/react";

const CreateExportAvitoTaskPage = () => {
	const { mutateAsync } = api.export.createAvitoExportTask.useMutation();
	function handleSubmit(data: ExportAvitoSchema) {
		void mutateAsync(data);
	}

	return (
		<div className="flex flex-col">
			<div className="heading-2xl">Новая выгрузка</div>
			<ExportAvitoForm onSubmit={handleSubmit} />
		</div>
	);
};

export default CreateExportAvitoTaskPage;
