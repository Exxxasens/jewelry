import { Material } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatInserts } from "~/lib/formatInserts";
import priceFormatter from "~/lib/priceFormatter";
import { getColorLabel } from "~/lib/productColorOptions";
import { productMaterialOptionsMap } from "~/lib/productMaterialOptions";
import { api } from "~/trpc/server";
import getMediaURL from "~/utils/getImageURL";

function getMaterial(material: string) {
	if (material in productMaterialOptionsMap) {
		return productMaterialOptionsMap[material as Material];
	}
	return undefined;
}

interface ProductPageProps {
	params: {
		id: string;
	};
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
	const { id } = params;

	if (!id) {
		return notFound();
	}

	const product = await api.product.getById({
		id,
	});

	if (!product) {
		return notFound();
	}

	const {
		productMedia,
		name,
		price,
		description,
		sku,
		brandName,
		material,
		color,
		probe,
		inserts,
		stones,
	} = product;

	const firstImage = productMedia[0]?.filename;

	return (
		<div className="flex justify-center px-8">
			<div className="mt-16 flex flex-col">
				<div className="flex flex-row gap-8">
					<div className="flex h-full w-full">
						<Image
							src={getMediaURL(firstImage)}
							alt={`Image of ${name}`}
							height={600}
							width={600}
							className="h-full max-h-[600px] w-full max-w-[600px]"
						/>
					</div>
					<div className="flex flex-col">
						<div>
							<h1 className="text-xl font-light">{name}</h1>
						</div>
						<div className="mt-8 text-xl font-normal">
							{price && priceFormatter.format(price)}
						</div>
					</div>
				</div>

				<div className="mt-8 flex flex-col gap-4">
					<div className="text-sm font-semibold uppercase">
						Информация о продукте
					</div>
					<div className="max-w-[500px] font-light">
						{description}
					</div>
					<div className="text-dark/60">арт. {sku}</div>

					<table className="max-w-xl font-light text-dark/90">
						<tbody>
							{brandName && (
								<tr>
									<td>Бренд</td>
									<td>{brandName}</td>
								</tr>
							)}
							{material && (
								<tr>
									<td>Материал</td>
									<td>{getMaterial(material)}</td>
								</tr>
							)}

							{probe && (
								<tr>
									<td>Проба</td>
									<td>{probe}</td>
								</tr>
							)}

							{color && (
								<tr>
									<td>Цвет</td>
									<td>{getColorLabel(color)}</td>
								</tr>
							)}

							{inserts && (
								<tr>
									<td>Вставки</td>
									<td>{formatInserts(inserts).join(", ")}</td>
								</tr>
							)}

							{stones && (
								<tr>
									<td>Количество камней</td>
									<td>{stones}</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
