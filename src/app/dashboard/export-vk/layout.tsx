import ExportTopbar from "~/components/Dashboard/ExportVK/ExportTopbar";

const ExportVKPageLayout: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return (
		// TODO: color theme
		<div className="flex flex-col">
			<h1 className="page-heading">Выгрузка ВК</h1>
			<ExportTopbar />
			<div className="flex flex-col">{children}</div>
		</div>
	);
};

export default ExportVKPageLayout;
