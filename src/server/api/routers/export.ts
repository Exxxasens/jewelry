import exportVKSchema from "~/lib/schemas/exportVKSchema";
import { adminProtectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { db } from "~/server/db";
import { env } from "~/env";
import { type Prisma, TaskState, TaskType } from "@prisma/client";
import createProductDescription from "~/utils/createProductDescription";
import path from "path";
import fs from "fs";
import z from "zod";
import delay from "~/utils/delay";
import exportAvitoSchema from "~/lib/schemas/exportAvitoSchema";
import { VKMarketApi } from "~/lib/vk/VKMarketApi";
import transformCategory from "~/lib/vk/transformCategory";
import VKGroupsApi from "~/lib/vk/VKGroupsApi";
import AvitoXMLBuilder from "~/lib/avito/XMLBuilder";
import getMediaURL from "~/utils/getImageURL";
import InsertsEnum from "~/lib/avito/insertsEnum";

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

async function finishTaskWithError(id: string, error: string) {
	await db.exportTask.update({
		where: {
			id,
		},
		data: {
			finishedAt: new Date(),
			state: "Cancelled",
			error,
		},
	});
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
					state: TaskState.Scheduled,
					type: TaskType.ExportVK,
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
				const errorString =
					error instanceof Error
						? `${error.message} | ${error.stack}`
						: String(error);
				await finishTaskWithError(task.id, errorString);
			}

			return task;
		}),

	createAvitoExportTask: adminProtectedProcedure
		.input(exportAvitoSchema)
		.mutation(async ({ input }) => {
			const products = await db.product.findMany({
				where: {
					id: {
						in: input.products.map((product) => product.id),
					},
				},
				include: {
					productMedia: true,
					inserts: true,
				},
			});

			const task = await db.exportTask.create({
				data: {
					name:
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
						input.name ||
						`Выгрузка от ${new Date().toLocaleString()}`,
					state: TaskState.Scheduled,
					type: TaskType.ExportAvito,
					products: {
						connect: products.map((item) => ({
							id: item.id,
						})),
					},
				},
			});

			try {
				const taskProducts = await getProductsFromTask(task.id);

				const xmlString = AvitoXMLBuilder.build(
					taskProducts.map((product) => {
						const inserts = product.inserts
							.map((insert) => insert.type)
							.filter((insert) =>
								Object.values(InsertsEnum).includes(
									insert as InsertsEnum,
								),
							) as InsertsEnum[];
						return {
							id: product.id,
							address: "г. Симферополь, ул. Сакская 81",
							name: product.name,
							price: product.price,
							description:
								createProductDescription(product) ?? "Тест",
							images: product.productMedia.map((item) =>
								getMediaURL(item.filename),
							),
							category: "Часы и украшения",
							adType: "Товар приобретен на продажу",
							condition: "New",
							brand: product.brandName,
							color: product.color,
							goodsSubType: product.category,
							size: product.size,
							material: product.material,
							probe: product.probe,
							inserts: inserts,
							numberOfStones: product.stones,
						};
					}),
				);

				const updated = await db.exportTask.update({
					where: {
						id: task.id,
					},
					data: {
						AvitoXML: xmlString,
						finishedAt: new Date(),
						state: "Finished",
					},
				});

				return updated;
			} catch (error) {
				const errorString =
					error instanceof Error
						? `${error.message} | ${error.stack}`
						: String(error);
				await finishTaskWithError(task.id, errorString);
			}
		}),

	getUserGroups: adminProtectedProcedure.query(async () => {
		const groupApi = new VKGroupsApi(env.VK_TOKEN);
		try {
			const response = await groupApi.get({
				filter: "admin",
			});
			// if (response.status > 200) {
			// }
			return response.data.response.items.filter(
				(group) => !group.is_closed,
			);
		} catch (error) {
			console.log(error);
		}
	}),

	getExportTasks: adminProtectedProcedure
		.input(
			z.object({
				type: z.nativeEnum(TaskType),
				take: z.number().default(10),
				skip: z.number().default(0),
			}),
		)
		.query(async ({ input }) => {
			return db.exportTask.findMany({
				where: {
					type: input.type,
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
