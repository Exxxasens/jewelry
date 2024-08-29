import Image from "next/image";
import { type RouterOutputs } from "~/trpc/react";
import getMediaURL from "~/utils/getImageURL";
import Status from "../Status";
import priceFormatter from "~/lib/priceFormatter";
import { FiMoreHorizontal } from "react-icons/fi";
import CategoryTag from "../CategoryTag";

interface RowProps {
	product: ArrayElement<RouterOutputs["product"]["getDashboardProductList"]>;
}

const Row: React.FC<RowProps> = ({ product }) => {
	const image = product.productMedia[0];
	const { sku, name, category, status, price, oldPrice } = product;

	function toggleStatus() {
		// TODO: toggle product status...
		return null;
	}

	return (
		<tr className="">
			<td className="h-0 pt-3">
				<div className="flex h-full items-center justify-center rounded-l-md bg-dark/10 p-3">
					<Image
						alt="img"
						src={getMediaURL(image?.filename)}
						width={96}
						height={96}
						className="rounded-sm bg-white object-contain"
					/>
				</div>
			</td>
			<td className="h-0 pt-3">
				<div className="flex h-full items-center justify-center bg-dark/10 p-3 font-semibold">
					{sku}
				</div>
			</td>

			<td className="h-0 pt-3">
				<div className="flex h-full items-center justify-center bg-dark/10 p-3 text-base">
					{name}
				</div>
			</td>
			<td className="h-0 max-w-lg pt-3 text-center">
				<div className="flex h-full flex-wrap items-center justify-center gap-2 bg-dark/10 p-3">
					<CategoryTag category={category} />
				</div>
			</td>
			<td className="h-0 pt-3 text-center">
				<div className="flex h-full items-center justify-center bg-dark/10 p-3">
					<Status status={status} onClick={toggleStatus} />
				</div>
			</td>
			<td className="h-0 pt-3">
				<div className="flex h-full items-center justify-center bg-dark/10 p-3"></div>
			</td>
			<td className="h-0 pt-3">
				<div className="flex h-full items-center justify-center bg-dark/10 p-3">
					{oldPrice && priceFormatter.format(oldPrice)}
				</div>
			</td>
			<td className="h-0 pt-3">
				<div className="flex h-full items-center justify-center bg-dark/10 p-3">
					{price && priceFormatter.format(price)}
				</div>
			</td>
			<td className="h-0 pt-3">
				<div className="flex h-full items-center justify-center rounded-r-md bg-dark/10 p-3">
					<button
						className="button-sm"
						type="button"
						onClick={() => void null}
					>
						<FiMoreHorizontal className="text-xl" />
					</button>
				</div>
			</td>
		</tr>
	);
};

export default Row;
