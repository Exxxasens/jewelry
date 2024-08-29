import exportVKSchema from "~/lib/schemas/exportVKSchema";
import { adminProtectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { db } from "~/server/db";
import axios from "axios";
import { env } from "~/env";
import { type Prisma, ProductCategory } from "@prisma/client";
import createProductDescription from "~/utils/createProductDescription";
import FormData from "form-data";
import path from "path";
import fs from "fs";
import z from "zod";
import delay from "~/utils/delay";

class VKApi {
	url = "https://api.vk.ru";
	baseParams = {
		v: "5.199",
	};
	accessToken: string;

	constructor(key: string) {
		this.accessToken = key;
	}

	appendParams(payload: object, params: URLSearchParams) {
		Object.entries(payload).map(([key, value]) => {
			params.append(String(key), String(value));
		});
	}

	getRequest<R = unknown>(method: string, params: URLSearchParams) {
		// append base params...
		this.appendParams(this.baseParams, params);

		return axios.get<R>(
			this.url + "/method/" + method + "?" + params.toString(),
			{
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
				},
			},
		);
	}
}

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

class VKMarketApi extends VKApi {
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

type GroupFilter =
	| "admin"
	| "editor"
	| "moder"
	| "advertiser"
	| "groups"
	| "publics"
	| "events"
	| "hasAddress";

interface UserGroupsRequest {
	user_id?: number; // Идентификатор пользователя, информацию о сообществах которого требуется получить.
	filter?: GroupFilter; // Список фильтров сообществ, которые необходимо вернуть. По умолчанию возвращаются все сообщества.
	offset?: number; // Смещение для выборки подмножества сообществ.
	count?: number; // Количество сообществ, информацию о которых нужно вернуть. Максимум 1000.
}

interface UserGroupResponse {
	response: {
		count: number;
		items: {
			id: number; // Идентификатор группы.
			description: string; // Описание группы.
			activity: string; // Вид деятельности группы.
			name: string; // Название группы.
			screen_name: string; // Короткое имя группы (доменное имя).
			is_closed: 0 | 1 | 2; // Статус группы: 0 — открытая, 1 — закрытая, 2 — частная.
			type: "group" | "page" | "event"; // Тип группы: группа, публичная страница или событие.
			is_admin: 0 | 1; // Признак, является ли текущий пользователь администратором.
			admin_level?: 1 | 2 | 3; // Уровень администратора: 1 — модератор, 2 — редактор, 3 — администратор.
			is_member: 0 | 1; // Признак, является ли текущий пользователь участником группы.
			is_advertiser: 0 | 1; // Признак, является ли текущий пользователь рекламодателем в группе.
			photo_50: string; // URL изображения группы размером 50x50 пикселей.
			photo_100: string; // URL изображения группы размером 100x100 пикселей.
			photo_200: string; // URL изображения группы размером 200x200 пикселей.
		}[];
	};
}

class VKGroupsApi extends VKApi {
	get(payload: UserGroupsRequest) {
		const params = new URLSearchParams();
		params.append("extended", "1");
		this.appendParams(payload, params);
		return this.getRequest<UserGroupResponse>("groups.get", params);
	}
}

function transformCategory(category: ProductCategory) {
	if (category === ProductCategory.Bracelets) {
		return 50062; // Браслеты
	}
	if (category === ProductCategory.Brooches) {
		return 50053; // Броши, значки и пины
	}
	if (category === ProductCategory.Chains) {
		return 50057; // Цепи и подвески
	}
	if (category === ProductCategory.Charms) {
		return 50354; // Шармы
	}
	if (category === ProductCategory.CompleteSet) {
		return 50067; // Комплекты украшений
	}
	if (category === ProductCategory.Earrings) {
		return 50056; // Серьги
	}
	if (category === ProductCategory.Necklace) {
		return 50063;
	}
	if (category === ProductCategory.Other) {
		return 40064; // Ювелирные украшения
	}
	if (category === ProductCategory.Pendants) {
		return 40064; // Ювелирные украшения
	}
	if (category === ProductCategory.Piercing) {
		return 50068;
	}
	if (category === ProductCategory.Religious) {
		return 40064; // Ювелирные украшения
	}
	if (category === ProductCategory.Rings) {
		return 50101;
	}
	return 40064;
}

function getProductsFromTask(taskId: string) {
	return db.product.findMany({
		where: {
			SyncTask: {
				some: {
					id: taskId,
				},
			},
		},
		include: {
			inserts: true,
			productMedia: {
				include: {
					media: true,
				},
			},
		},
	});
}

export type ProductsFromTask = Prisma.PromiseReturnType<
	typeof getProductsFromTask
>;

async function uploadImage(
	marketApi: VKMarketApi,
	VKGroupId: number,
	filepath: string,
) {
	const {
		data: {
			response: { upload_url: serverUploadURL },
		},
	} = await marketApi.getProductPhotoUploadServer({
		group_id: VKGroupId,
	});

	const fileStream = fs.createReadStream(path.join("./", filepath));

	const { data: uploadedImage } = await marketApi.uploadProductPhoto(
		serverUploadURL,
		fileStream,
	);

	const {
		data: { response: savedImage },
	} = await marketApi.saveProductPhoto({
		upload_response: JSON.stringify(uploadedImage),
	});
	return savedImage;
}

async function syncProduct(
	VKGroupId: number,
	product: ArrayElement<ProductsFromTask>,
) {
	const marketApi = new VKMarketApi(env.VK_TOKEN);
	const {
		id,
		name,
		category,
		sku,
		price,
		oldPrice,
		productMedia,
		VKMarketId,
	} = product;

	const image = productMedia.sort((a, b) => a.order - b.order);
	const mainImage = image[0];
	const otherImages = image.slice(1, 5);

	if (!mainImage) {
		return;
	}

	const savedMainImage = await uploadImage(
		marketApi,
		VKGroupId,
		mainImage.media.filepath,
	);
	const savedOtherImages = await Promise.all(
		otherImages.map((image) =>
			uploadImage(marketApi, VKGroupId, image.media.filepath),
		),
	);
	const category_id = transformCategory(category);

	if (!VKMarketId) {
		// create new
		const result = await marketApi.add({
			owner_id: `-${VKGroupId}`,
			name,
			description: createProductDescription(product),
			category_id,
			main_photo_id: savedMainImage.photo_id,
			photo_ids: savedOtherImages
				.map((image) => image.photo_id)
				.join(","),
			price: String(price),
			old_price: String(oldPrice),
			sku: sku,
		});
		await db.product.update({
			where: {
				id,
			},
			data: {
				VKMarketId: result.data.response.market_item_id,
			},
		});
		return;
	}

	const response = await marketApi.edit({
		item_id: VKMarketId,
		owner_id: `-${VKGroupId}`,
		name,
		description: createProductDescription(product),
		category_id,
		main_photo_id: savedMainImage.photo_id,
		photo_ids: savedOtherImages.map((image) => image.photo_id).join(","),
		price: String(price),
		old_price: String(oldPrice),
		sku: sku,
	});

	console.log(response);
}

async function processExportTask(id: string) {
	const task = await db.exportTask.findUnique({
		where: {
			id,
			VKGroupId: {
				not: null,
			},
		},
	});

	if (!task?.VKGroupId) {
		return;
	}

	const products = await getProductsFromTask(task.id);
	const { VKGroupId } = task;
	// const {
	// 	data: {
	// 		response: { items: categories },
	// 	},
	// } = await marketApi.getCategories();
	try {
		for (const product of products) {
			await syncProduct(VKGroupId, product);
			// wait 100ms after update...
			await delay(100);
		}

		await db.exportTask.update({
			where: {
				id,
			},
			data: {
				finishedAt: new Date(),
				state: "Finished",
			},
		});
	} catch (error) {
		// TODO: log error data...

		await db.exportTask.update({
			where: {
				id,
			},
			data: {
				finishedAt: new Date(),
				state: "Cancelled",
			},
		});
	}
}

export const exportRouter = createTRPCRouter({
	createVKExportTask: adminProtectedProcedure
		.input(exportVKSchema)
		.mutation(async ({ input }) => {
			const products = await db.product.findMany({
				where: {
					id: {
						in: input.products.map((product) => product.id),
					},
				},
			});

			const task = await db.exportTask.create({
				data: {
					name:
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
						input.name ||
						`Выгрузка от ${new Date().toLocaleString()}`,
					state: "Scheduled",
					type: "ExportVK",
					VKGroupId: input.group,
					products: {
						connect: products.map((item) => ({
							id: item.id,
						})),
					},
				},
			});

			try {
				await processExportTask(task.id);
			} catch (error) {
				console.log(error);
			}

			return task;
		}),

	getUserGroups: adminProtectedProcedure.query(async () => {
		const groupApi = new VKGroupsApi(env.VK_TOKEN);
		try {
			const response = await groupApi.get({
				filter: "admin",
			});
			// if (response.status > 200) {
			// }
			return response.data.response;
		} catch (error) {
			console.log(error);
		}
	}),

	getExportTasks: adminProtectedProcedure
		.input(
			z.object({
				take: z.number().default(10),
				skip: z.number().default(0),
			}),
		)
		.query(async ({ input }) => {
			return db.exportTask.findMany({
				where: {
					type: "ExportVK",
				},
				orderBy: {
					createdAt: "desc",
				},
				include: {
					_count: {
						select: {
							products: true,
						},
					},
				},
				take: input.take,
				skip: input.skip,
			});
		}),
});
