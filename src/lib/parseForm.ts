import mime from "mime";
import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
import { type NextApiRequest } from "next";
import getUploadDir from "~/utils/getUploadDir";

const MAX_FILE_SIZE = 1024 * 1024 * 32;

const parseForm = async (
	req: NextApiRequest,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	return new Promise(async (resolve, reject) => {
		const uploadDir = getUploadDir();

		try {
			await stat(uploadDir);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (e.code === "ENOENT") {
				await mkdir(uploadDir, { recursive: true });
			} else {
				console.error(e);
				reject(e);
				return;
			}
		}

		const form = formidable({
			hashAlgorithm: "sha1",
			maxFiles: 1,
			maxFileSize: MAX_FILE_SIZE,
			uploadDir: uploadDir,
			filename: (_name, _ext, part) => {
				const uniqueSuffix = `${Date.now()}-${Math.round(
					Math.random() * 1e9,
				)}`;
				const ext = mime.getExtension(part.mimetype ?? "");
				const filename = `${part.name ?? "unknown"}-${uniqueSuffix}.${
					ext ?? "unknown"
				}`;
				return filename;
			},
			filter: (part) => {
				return (
					part.name === "media" &&
					(part.mimetype?.includes("image") ?? false)
				);
			},
		});

		form.parse(req, function (err, fields, files) {
			if (err) reject(err);
			else resolve({ fields, files });
		});
	});
};

export default parseForm;
