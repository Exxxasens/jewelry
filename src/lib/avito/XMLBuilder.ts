import {
	type NumberOfStones,
	type Color,
	type Material,
	type ProductCategory,
} from "@prisma/client";
import builder, { type XMLElement } from "xmlbuilder";
import { getColorLabel } from "../productColorOptions";
import { categoriesMap } from "../productCategoriesOptions";
import { productMaterialOptionsMap } from "../productMaterialOptions";
import type InsertsEnum from "./insertsEnum";
import { InsertLabelsMap } from "../productInsertOptions";
import { numOfStonesMap } from "../productNumOfStonesOptions";

// const result = builder
// 	.create("Ads", { headless: true })
// 	.att("formatVersion", 3)
// 	.att("target", "Avito.ru")
// 	.ele("Ad")
// 	.end({
// 		pretty: true,
// 	});

type AdType = "Товар приобретен на продажу" | "Товар от производителя";

interface AdBase {
	id: string;
	/**
	 * Вариант платного размещения
	 * Необязательное поле
	 * Возможные значения:
	 * - "Package" (по умолчанию)
	 * - "PackageSingle"
	 * - "Single"
	 */
	listingFee?: "Package" | "PackageSingle" | "Single";
	address: string;
	name: string;
	price: string | number;
	description: string;
	images: string[];
	category: string;
	goodsType?: string;
	adType: AdType;
	condition?: "New" | "Used";
	brand?: string | null;
	color?: Color | null;
	goodsSubType?: ProductCategory;
	size?: string | null;
	material?: Material | null;
	probe?: string | null;
	inserts?: InsertsEnum[];
	numberOfStones?: NumberOfStones | null;
}

export default class AvitoXMLBuilder {
	static createHead() {
		return builder
			.create("Ads", { headless: true })
			.att("formatVersion", 3)
			.att("target", "Avito.ru");
	}

	static createAd(head: XMLElement, ad: AdBase) {
		const adElement = head.ele("Ad");

		const {
			id,
			listingFee,
			address,
			name,
			price,
			description,
			images,
			category,
			goodsType,
			adType,
			condition,
			brand,
			color,
			goodsSubType,
			size,
			material,
			probe,
			inserts,
			numberOfStones,
		} = ad;

		adElement.ele("Id", {}, id);

		if (listingFee) {
			adElement.ele("ListingFee", {}, listingFee);
		}

		adElement.ele("Address", {}, address);
		adElement.ele("Title", {}, name);
		adElement.ele("Description", {}, description);
		adElement.ele("Price", {}, price);

		const imageElement = adElement.ele("Images");

		images.forEach((image) => {
			imageElement.ele("Image", { url: image });
		});

		adElement.ele("Category", {}, category);
		adElement.ele("goodsType", {}, goodsType ?? "Ювелирные изделия");
		adElement.ele("AdType", {}, adType);
		adElement.ele("Condition", {}, condition === "Used" ? "Б/у" : "Новое");

		if (brand) {
			adElement.ele("Brand", {}, brand);
		}

		if (color) {
			adElement.ele("Color", {}, getColorLabel(color));
		}

		if (goodsSubType) {
			adElement.ele("GoodsSubType", {}, categoriesMap[goodsSubType]);
		}

		if (size) {
			adElement.ele("Size", {}, size);
		}

		if (material) {
			adElement.ele("Material", {}, productMaterialOptionsMap[material]);
		}

		if (probe) {
			adElement.ele("Proba", {}, probe);
		}

		if (inserts && inserts.length > 0) {
			const insertElement = adElement.ele("InsertStone");
			inserts.forEach((insert) => {
				insertElement.ele(
					"Option",
					{},
					InsertLabelsMap[insert] || "Другое",
				);
			});
		}

		if (numberOfStones) {
			adElement.ele("NumberOfStones", numOfStonesMap[numberOfStones]);
		}

		return adElement;
	}

	static build(ads: AdBase[]) {
		const head = this.createHead();
		ads.forEach((ad) => {
			this.createAd(head, ad);
		});
		return head.end({
			pretty: true,
		});
	}
}
