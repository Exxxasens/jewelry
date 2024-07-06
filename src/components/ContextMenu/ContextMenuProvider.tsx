"use client";

import React, {
	createContext,
	useState,
	useContext,
	type PropsWithChildren,
} from "react";

export interface IMenuItem {
	title?: string;
	icon?: React.ReactNode;
	className?: string;
	handler?: () => void;
}

export interface MenuPosition {
	x: number;
	y: number;
}

export interface ContextMenuState {
	content: IMenuItem[];
	position: MenuPosition;
	show: boolean;
}

export interface ContextMenuActions {
	setContextMenu: (content: IMenuItem[]) => void;
	showContextMenu: () => void;
	hideContextMenu: () => void;
	setPosition: (position: MenuPosition) => void;
}

const initialState: ContextMenuState = {
	content: [],
	position: {
		x: 0,
		y: 0,
	},
	show: false,
};

const ContextMenuContext = createContext<ContextMenuState | undefined>(
	undefined,
);
const ContextMenuDispatchContext = createContext<
	ContextMenuActions | undefined
>(undefined);

export const ContextMenuProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const [state, setState] = useState<ContextMenuState>(initialState);

	const setContextMenu = (content: IMenuItem[]) => {
		setState((prevState) => ({ ...prevState, content }));
	};

	const showContextMenu = () => {
		setState((prevState) => ({ ...prevState, show: true }));
	};

	const hideContextMenu = () => {
		setState((prevState) => ({ ...prevState, show: false }));
	};

	const setPosition = (position: MenuPosition) => {
		setState((prevState) => ({ ...prevState, position }));
	};

	const contextActions: ContextMenuActions = {
		setContextMenu,
		showContextMenu,
		hideContextMenu,
		setPosition,
	};

	return (
		<ContextMenuContext.Provider value={state}>
			<ContextMenuDispatchContext.Provider value={contextActions}>
				{children}
			</ContextMenuDispatchContext.Provider>
		</ContextMenuContext.Provider>
	);
};

export const useContextMenuState = () => {
	const context = useContext(ContextMenuContext);
	if (context === undefined) {
		throw new Error(
			"useContextMenuState must be used within a ContextMenuProvider",
		);
	}
	return context;
};

export const useContextMenuActions = () => {
	const context = useContext(ContextMenuDispatchContext);
	if (context === undefined) {
		throw new Error(
			"useContextMenuActions must be used within a ContextMenuProvider",
		);
	}
	return context;
};
