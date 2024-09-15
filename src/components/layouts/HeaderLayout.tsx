import { type PropsWithChildren } from "react";
import Header from "../Header";

const HeaderLayout: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex-col">
			<Header />
			<div className="flex flex-col">{children}</div>
		</div>
	);
};

export default HeaderLayout;
