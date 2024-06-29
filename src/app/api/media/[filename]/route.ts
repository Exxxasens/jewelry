import { type NextApiRequest } from "next";

import fs from "fs";
import path from "path";

import { db } from "~/server/db";
import { env } from "~/env";

const filePath = path.join(".", env.MEDIA_PATH);

export async function GET(
	request: NextApiRequest,
	{ params }: { params: { filename: string } },
) {
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
