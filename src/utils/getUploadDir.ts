import path from "path";
import { env } from "~/env";

export default function getUploadDir() {
	return path.join(process.env.ROOT_DIR ?? process.cwd(), env.MEDIA_PATH);
}
