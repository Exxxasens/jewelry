// import ExportTopbar from "~/components/Dashboard/ExportVK/ExportTopbar";

import ExportAvitoTopbar from "~/components/Dashboard/ExportAvito/ExportAvitoTopbar";

const ExportAvitoPageLayout: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return (
		// TODO: color theme
		<div className="flex flex-col">
			<h1 className="page-heading">Выгрузка Avito</h1>
			{/* <ExportTopbar /> */}
			<ExportAvitoTopbar />
			<div className="flex flex-col">{children}</div>
		</div>
	);
};

export default ExportAvitoPageLayout;
