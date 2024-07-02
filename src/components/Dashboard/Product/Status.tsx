import { ProductStatus } from "@prisma/client";

interface StatusProps {
	status: ProductStatus;
	onClick: () => void;
}

const Status: React.FC<StatusProps> = ({ status, ...rest }) => {
	if (status === ProductStatus.Hidden) {
		return (
			<div
				className="tag bg-red/80 hover:bg-red cursor-pointer text-white/90"
				{...rest}
			>
				Скрыт
			</div>
		);
	}
	if (status === ProductStatus.Published) {
		return (
			<div className="tag cursor-pointer bg-dark text-white/90" {...rest}>
				Отображается
			</div>
		);
	}
	return null;
};

export default Status;
