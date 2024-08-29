"use client";

import { FiX } from "react-icons/fi";
import { usePopup } from "./PopupContext";

const Popup = () => {
	const { isPopupOpen, popupContent, closePopup } = usePopup();

	if (!isPopupOpen) {
		return null;
	}

	return (
		<div className="popup-overlay" onClick={closePopup}>
			<div className="popup-content" onClick={(e) => e.stopPropagation()}>
				<button
					className="close-button button-sm p-2"
					onClick={closePopup}
				>
					<FiX />
				</button>
				{popupContent}
			</div>
		</div>
	);
};

export default Popup;
