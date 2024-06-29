export default function getMediaURL(filename?: string) {
	if (!filename) {
		return "/no_image_placeholder.svg";
	}

	return `/api/media/${filename}`;
}
