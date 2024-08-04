import ProductTopbar from "~/components/Dashboard/Product/ProductTopbar";

const CollectionPageLayout: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return (
		// TODO: color theme
		<div className="flex flex-col">
			<h1 className="page-heading">Подборки</h1>
			<div className="flex flex-col">{children}</div>
		</div>
	);
};

export default CollectionPageLayout;
