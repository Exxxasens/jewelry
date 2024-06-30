import { MediaType } from "@prisma/client";

export default function getMediaType(type: string): MediaType {
	if (type.includes("video")) {
		return MediaType.Video;
	}
	return MediaType.Image;
}
