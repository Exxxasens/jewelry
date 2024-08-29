"use client";

import React, {
	createContext,
	useState,
	type ReactNode,
	type PropsWithChildren,
	useContext,
} from "react";

interface PopupContextType {
	isPopupOpen: boolean;
	popupContent: ReactNode | null;
	openPopup: (content: ReactNode) => void;
	closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

const PopupContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [isOpen, setOpen] = useState(false);
	const [content, setContent] = useState<ReactNode | null>(null);

	const openPopup = (content: ReactNode) => {
		setContent(content);
		setOpen(true);
	};

	const closePopup = () => {
		setOpen(false);
		setContent(null);
	};

	const contextValue = {
		isPopupOpen: isOpen,
		popupContent: content,
		openPopup,
		closePopup,
	} satisfies PopupContextType;

	return (
		<PopupContext.Provider value={contextValue}>
			{children}
		</PopupContext.Provider>
	);
};

const usePopup = () => {
	const context = useContext(PopupContext);
	if (context === undefined) {
		throw new Error("usePopup must be used within a PopupProvider");
	}
	return context;
};

export { PopupContext, PopupContextProvider, usePopup };
