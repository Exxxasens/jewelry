import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

interface RouteHandlerContext {
	id: string;
}

export async function GET(_req: NextRequest, params: RouteHandlerContext) {
	const { id } = params;

	const task = await db.exportTask.findUnique({
		where: {
			id,
		},
	});

	const xmlString = task?.AvitoXML;

	if (!xmlString) {
		return Response.json({ error: "Task not found" }, { status: 404 });
	}

	const headers = new Headers();
	headers.set("Content-Type", "text/xml");

	return new NextResponse(xmlString, { headers });
}
