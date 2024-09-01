"use client";

import ExportVKForm from "~/components/Dashboard/ExportVK/Form";
import { type ExportVKSchema } from "~/lib/schemas/exportVKSchema";
import { api } from "~/trpc/react";

const CreateExportVKTaskPage = () => {
	const { mutateAsync } = api.export.createVKExportTask.useMutation();
	function handleSubmit(data: ExportVKSchema) {
		void mutateAsync(data);
	}

	return (
		<div className="flex flex-col">
			<div className="heading-2xl">Новая выгрузка</div>
			<ExportVKForm onSubmit={handleSubmit} />
		</div>
	);
};

export default CreateExportVKTaskPage;
