"use client";
import {
	type HTMLProps,
	useState,
	type PropsWithChildren,
	Dispatch,
	SetStateAction,
} from "react";

const LinkButton: React.FC<
	PropsWithChildren & HTMLProps<HTMLButtonElement>
> = ({ children, type, ...rest }) => {
	return (
		<button {...rest} type="button">
			<span>{children}</span>
		</button>
	);
};

export enum NavbarButtons {
	Catalog,
	Collections,
	AboutUs,
}

interface NavbarProps {
	setOpen: Dispatch<SetStateAction<NavbarButtons | undefined>>;
}

const Navbar: React.FC<NavbarProps> = ({ setOpen }) => {
	return (
		<div className="flex flex-row items-center justify-center gap-8 text-base font-medium tracking-widest">
			<LinkButton
				onClick={() => setOpen(NavbarButtons.Catalog)}
				onMouseOver={() => setOpen(NavbarButtons.Catalog)}
			>
				Каталог
			</LinkButton>
			<LinkButton
				onClick={() => setOpen(NavbarButtons.Collections)}
				onMouseOver={() => setOpen(NavbarButtons.Collections)}
			>
				Коллекции
			</LinkButton>
			<LinkButton>О нас</LinkButton>
		</div>
	);
};

export default Navbar;
