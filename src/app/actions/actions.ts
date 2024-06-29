"use server";

import fs from "node:fs/promises";
import { db } from "~/server/db";
import mime from "mime";
import { env } from "~/env";
import path from "node:path";

export async function uploadFile(formData: FormData) {
	const allowedFileTypes = [
		"image/png",
		"image/jpeg",
		"image/gif",
		"video/mp4",
	];
	const file = formData.get("file") as File;
	const originalFilename = formData.get("filename")?.toString();

	if (!originalFilename) {
		throw new Error("Filename not specified");
	}

	const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

	if (!allowedFileTypes.includes(file.type)) {
		return {
			error: "File type not allowed",
		};
	}
	const ext = mime.getExtension(file.type);
	const filename = `${uniqueSuffix}.${ext ?? "unknown"}`;

	try {
		const result = await db.media.create({
			data: {
				filename,
				filepath: path.join(env.MEDIA_PATH, filename),
				originalFilename: originalFilename,
				mimetype: file.type,
				size: file.size,
			},
		});

		const arrayBuffer = await file.arrayBuffer();
		const buffer = new Uint8Array(arrayBuffer);
		await fs.writeFile(path.join("./", env.MEDIA_PATH, filename), buffer);

		return {
			result,
		};
	} catch (error) {
		console.log(error);
		await db.media.delete({
			where: {
				filename,
			},
		});
		return {
			error: "Error",
		};
	}

	//revalidatePath("/");
}
