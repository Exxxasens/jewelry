import fs from "fs";
import path from "path";

import { db } from "~/server/db";
import { env } from "~/env";
import { type NextRequest } from "next/server";

const filePath = path.join(".", env.MEDIA_PATH);

interface RouteHandlerContext {
	params: {
		filename: string;
	};
}

export async function GET(_req: NextRequest, { params }: RouteHandlerContext) {
	const { filename } = params;

	const foundFile = await db.media.findUnique({
		where: {
			filename,
		},
		select: {
			filename: true,
			mimetype: true,
			size: true,
		},
	});

	if (!foundFile) {
		return Response.json({ error: "Media not found" }, { status: 404 });
	}

	const headers = new Headers();
	if (foundFile.mimetype) {
		headers.set("Content-Type", foundFile.mimetype?.toString());
	}
	headers.set("Content-Length", foundFile.size.toString());

	const imageStream = fs.createReadStream(
		path.resolve(path.join(filePath, foundFile.filename)),
	);

	return new Response(imageStream as unknown as ReadableStream, { headers });
}
