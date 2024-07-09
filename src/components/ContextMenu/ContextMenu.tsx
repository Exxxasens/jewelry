"use client";

import React, { useRef, useEffect } from "react";
import {
	useContextMenuActions,
	useContextMenuState,
} from "./ContextMenuProvider";

export interface MenuElementProps {
	icon?: React.ReactNode;
	title?: string;
	onClick?: () => void;
}

const MenuElement: React.FC<MenuElementProps> = ({
	icon,
	title,
	onClick = () => null,
}) => {
	// TODO: add color to tailwind config
	if (!icon && !title) {
		return <div className="h-px w-[95%] bg-dark/10"></div>;
	}

	return (
		<button
			key={title}
			onClick={onClick}
			className="button-sm w-full justify-start whitespace-nowrap border-none"
		>
			{icon && (
				<div className="mr-2 flex items-center justify-center">
					{icon}
				</div>
			)}
			{title && <div>{title}</div>}
		</button>
	);
};

const ContextMenu = () => {
	const { content, show, position } = useContextMenuState();
	const { hideContextMenu } = useContextMenuActions();
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (show && menuRef.current) {
			const width = menuRef.current.clientWidth + position.x;
			const height = menuRef.current.clientHeight + position.y;
			const translateX = width > window.innerWidth ? "-100%" : 0;
			const translateY = height > window.innerHeight ? "-100%" : 0;
			menuRef.current.style.transform = `translate(${translateX}, ${translateY})`;

			const handleMouseDown = (e: MouseEvent) => {
				const { target } = e;
				const { current } = menuRef;

				if (!target || !current) return null;

				if (target instanceof Element && !current.contains(target)) {
					hideContextMenu();
				}
			};

			document.addEventListener("mousedown", handleMouseDown);

			return () => {
				document.removeEventListener("mousedown", handleMouseDown);
			};
		}
	}, [show, position, hideContextMenu]);

	if (!show) return null;

	return (
		<div
			className={`absolute flex flex-col items-center gap-2 rounded-lg border border-solid border-dark/10 bg-[#F3F4F4] p-2 shadow-lg`}
			style={{ top: position.y + 16, left: position.x - 8 }}
			ref={menuRef}
		>
			{show &&
				content.map(({ title, icon, handler }, i) => (
					<MenuElement
						title={title}
						icon={icon}
						onClick={handler}
						key={i}
					/>
				))}
		</div>
	);
};

export default ContextMenu;
