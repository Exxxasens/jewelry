import VKApi from "./VKApi";
import type fs from "fs";
import FormData from "form-data";
import axios from "axios";

interface MarketAddRequest {
	owner_id: string; // Обязательный параметр. Идентификатор владельца товара. Идентификатор сообщества должен начинаться со знака "-".
	name: string; // Обязательный параметр. Название товара. Макс. длина = 100, Мин. длина = 4.
	description: string; // Обязательный параметр. Описание товара.
	category_id: number; // Обязательный параметр. Идентификатор категории товара.
	price?: string; // Необязательный параметр. Цена товара.
	old_price?: string; // Необязательный параметр. Старая цена товара.
	deleted?: 0 | 1; // Необязательный параметр. Статус товара. 0 — товар доступен, 1 — товар недоступен.
	main_photo_id: number; // Обязательный параметр. Идентификатор фотографии обложки товара.
	photo_ids?: string; // Необязательный параметр. Идентификаторы дополнительных фотографий товара, через запятую. Максимум 4.
	video_ids?: string; // Необязательный параметр. Идентификаторы видео товара.
	url?: string; // Необязательный параметр. Ссылка на сайт товара. Макс. длина = 320.
	variant_ids?: string; // Необязательный параметр. Список id вариантов свойств товаров. Не более 2 значений.
	is_main_variant?: boolean; // Необязательный параметр. Признак главного товара в группе.
	dimension_width?: number; // Необязательный параметр. Ширина в мм.
	dimension_height?: number; // Необязательный параметр. Высота в мм.
	dimension_length?: number; // Необязательный параметр. Глубина в мм.
	weight?: number; // Необязательный параметр. Вес в граммах.
	sku?: string; // Необязательный параметр. Артикул товара. Макс. длина = 50.
	stock_amount?: number; // Необязательный параметр. Количество товара в наличии. -1 — неограничено, 0 — недоступно, > 0 — конкретное количество.
}

interface MarketAddResponse {
	response: {
		market_item_id: number;
	};
}

interface MarketEditRequest {
	owner_id: string; // Обязательный параметр. Идентификатор владельца товара (со знаком - для сообщества).
	item_id: number; // Обязательный параметр. Идентификатор товара.
	name?: string; // Необязательный параметр. Новое название товара. Макс. длина = 100, Мин. длина = 4.
	description?: string; // Необязательный параметр. Новое описание товара.
	category_id?: number; // Необязательный параметр. Идентификатор категории товара.
	price?: string; // Необязательный параметр. Цена товара.
	old_price?: string; // Необязательный параметр. Старая цена товара.
	deleted?: boolean; // Необязательный параметр. Статус товара: true — товар недоступен, false — товар доступен.
	main_photo_id?: number; // Необязательный параметр. Идентификатор фотографии для обложки товара.
	photo_ids?: string; // Необязательный параметр. Идентификаторы дополнительных фотографий товара.
	video_ids?: string; // Необязательный параметр. Идентификаторы видео товара.
	url?: string; // Необязательный параметр. Ссылка на сайт товара. Макс. длина = 320, Мин. длина = 0.
	variant_ids?: string; // Необязательный параметр. Список id вариантов свойств товаров. Не более 2 значений.
	is_main_variant?: boolean; // Необязательный параметр. Признак, является ли товар главным в своей группе.
	dimension_width?: number; // Необязательный параметр. Ширина в миллиметрах.
	dimension_height?: number; // Необязательный параметр. Высота в миллиметрах.
	dimension_length?: number; // Необязательный параметр. Глубина в миллиметрах.
	weight?: number; // Необязательный параметр. Вес в граммах.
	sku?: string; // Необязательный параметр. Артикул товара (произвольная строка). Макс. длина = 50.
	stock_amount?: number; // Необязательный параметр. Количество товара в наличии: -1 = неограничено, 0 = недоступен, > 0 = количество товара.
}

interface MarketEditResponse {
	response: {
		market_item_id: number;
	};
}

interface GetCategoriesRequest {
	count?: number;
	offset?: number;
}

interface CategoryItem {
	id: number; // Идентификатор категории.
	name: string; // Название категории.
	view: {
		root_path: string[];
	}; // Объект, содержащий информацию о представлении категории.
	url: string; // URL категории.
}

interface CategoryResponse {
	response: {
		items: CategoryItem[]; // Массив объектов, представляющих категории.
	};
}

interface GetProductPhotoUploadServerRequest {
	group_id: number;
}

interface GetProductPhotoUploadServerResponse {
	response: {
		upload_url: string;
	};
}

interface SaveProductPhotoRequest {
	upload_response: string;
}

interface SaveProductPhotoResponse {
	response: {
		photo_id: number;
	};
}

interface UploadProductPhotoResponse {
	sha: string; // SHA hash of the image
	secret: string; // Secret key associated with the image
	meta: {
		height: string; // Height of the image as a string
		kid: string; // Unique identifier for the image
		width: string; // Width of the image as a string
	}; // Metadata related to the image (height, width, etc.)
	hash: string; // Hash of the image
	server: string; // Server identifier where the image is stored
	user_id: number; // ID of the user who uploaded the image
	group_id: number; // ID of the group associated with the image
	request_id: string; // Unique request identifier
	album_id: number; // ID of the album where the image is stored
	app_id: number; // ID of the application used for uploading
}

export class VKMarketApi extends VKApi {
	add(payload: MarketAddRequest) {
		const params = new URLSearchParams();
		this.appendParams(payload, params);
		return this.getRequest<MarketAddResponse>("market.add", params);
	}

	edit(payload: MarketEditRequest) {
		const params = new URLSearchParams();
		this.appendParams(payload, params);
		return this.getRequest<MarketEditResponse>("market.edit", params);
	}

	getCategories(payload: GetCategoriesRequest = {}) {
		const params = new URLSearchParams();
		this.appendParams(payload, params);
		return this.getRequest<CategoryResponse>(
			"market.getCategories",
			params,
		);
	}

	getProductPhotoUploadServer(payload: GetProductPhotoUploadServerRequest) {
		const params = new URLSearchParams();
		this.appendParams(payload, params);
		return this.getRequest<GetProductPhotoUploadServerResponse>(
			"market.getProductPhotoUploadServer",
			params,
		);
	}

	saveProductPhoto(payload: SaveProductPhotoRequest) {
		const params = new URLSearchParams();
		this.appendParams(payload, params);
		return this.getRequest<SaveProductPhotoResponse>(
			"market.saveProductPhoto",
			params,
		);
	}

	uploadProductPhoto(server: string, file: fs.ReadStream) {
		const formData = new FormData();
		formData.append("file", file);
		return axios.post<UploadProductPhotoResponse>(server, formData);
	}
}
