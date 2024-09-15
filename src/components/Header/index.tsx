"use client";
import { type PropsWithChildren, useState } from "react";
import Navbar, { NavbarButtons } from "../Navbar";
import { categoriesMap } from "~/lib/productCategoriesOptions";
import Link from "next/link";
import { api } from "~/trpc/react";
import Loading from "../Loading";

interface ColumnProps extends PropsWithChildren {
	heading: string;
}

const Column: React.FC<ColumnProps> = ({ heading, children }) => {
	return (
		<div>
			<h3 className="text-xl font-bold">{heading}</h3>
			<div className="mt-4 flex flex-col gap-2 text-base font-light">
				{children}
			</div>
		</div>
	);
};

const BrandColumn = () => {
	const { data, isLoading } = api.brand.fetchBrands.useQuery();

	return (
		<Column heading="Бренд">
			{isLoading && <Loading color="white" />}

			{data?.map(({ name }) => {
				return (
					<Link key={name} href={`/brand/${name}`}>
						{name}
					</Link>
				);
			})}
		</Column>
	);
};

const Header = () => {
	const [open, setOpen] = useState<NavbarButtons>();

	return (
		<div className="relative" onMouseLeave={() => setOpen(undefined)}>
			<div className="flex flex-row justify-between px-8 py-4">
				<h1 className="w-32 text-4xl font-bold uppercase">Tous</h1>
				<Navbar setOpen={setOpen} />
				<div className="w-32"></div>
			</div>

			{open === NavbarButtons.Catalog && (
				<div className="absolute top-full flex w-full flex-row gap-32 border-t border-solid border-black/30 bg-white px-8 py-4 shadow-xl">
					<Column heading="Категория">
						{Object.entries(categoriesMap).map(([key, value]) => {
							return (
								<Link key={key} href={`/category/${key}`}>
									{value}
								</Link>
							);
						})}
					</Column>
					<BrandColumn />
				</div>
			)}
		</div>
	);
};

export default Header;
