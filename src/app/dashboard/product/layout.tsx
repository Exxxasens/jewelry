import ProductTopbar from "~/components/Dashboard/Product/ProductTopbar";

const ProductPageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		// TODO: color theme
		<div className="flex flex-col">
			<h1 className="page-heading">Товары</h1>
			<ProductTopbar />
			<div className="flex flex-col">{children}</div>
		</div>
	);
};

export default ProductPageLayout;
