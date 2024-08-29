"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import getMediaURL from "~/utils/getImageURL";

interface CollectionProductCardProps {
	id: string;
}

const CollectionProductCard: React.FC<CollectionProductCardProps> = ({
	id,
}) => {
	const { data } = api.product.getById.useQuery({
		id,
	});

	if (!data) {
		return null;
	}

	const image = data.productMedia[0];

	return (
		<div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-[#F2F1F0]">
			{image && (
				<Image
					alt="img"
					src={getMediaURL(image.filename)}
					width={96}
					height={96}
					className="h-full w-full object-cover"
				/>
			)}
		</div>
	);
};

export default CollectionProductCard;
