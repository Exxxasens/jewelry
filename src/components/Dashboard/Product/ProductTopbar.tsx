"use client";
import ActiveLink from "../ActiveLink";

const ProductTopbar = () => {
	const activeBtnClass = "bg-dark text-white";

	return (
		<div className="mb-8 flex flex-row">
			<div className="button-group">
				<ActiveLink href="/dashboard/product" className="flex">
					{(isActive) => (
						<button
							className={`button-sm ${
								isActive ? activeBtnClass : ""
							}`}
						>
							Все товары
						</button>
					)}
				</ActiveLink>
				<ActiveLink href="/dashboard/product/create" className="flex">
					{(isActive) => (
						<button
							className={`button-sm ${
								isActive ? activeBtnClass : ""
							}`}
						>
							Добавить товар
						</button>
					)}
				</ActiveLink>
			</div>
		</div>
	);
};

export default ProductTopbar;
