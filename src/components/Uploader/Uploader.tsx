"use client";

import { type ChangeEvent, useState, useEffect, useCallback } from "react";
import { produce } from "immer";
import UploadingFile from "./UploadingFile";
import ImagePreview from "./ImagePreview";
import Loading from "../Loading";
import getMediaURL from "~/utils/getImageURL";
import { uploadFile } from "~/app/actions/actions";
import VideoPreview from "./VideoPreview";
import { PiX } from "react-icons/pi";
import getMediaType from "~/lib/getMediaType";
import { type MediaType } from "@prisma/client";

interface UploadingFile {
	filename: string | null;
	loading: boolean;
	file: File;
	size?: number;
	order: number;
	type?: MediaType;
}

type UploadedFile = Omit<UploadingFile, "file">;
type UploadingEndData = {
	filename: string;
	size: number;
	type: MediaType;
};

export interface UploaderProps {
	allowUpload?: boolean;
	limit?: number;
	onChange?: (value: UploadedFile[]) => void;
}

const Uploader: React.FC<UploaderProps> = ({
	allowUpload = true,
	limit,
	onChange,
}) => {
	const [uploadingList, setUploadingList] = useState<UploadingFile[]>([]);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!allowUpload) return;
		if (!files || files.length === 0) {
			return;
		}

		const fileArray: File[] = [];

		for (let i = 0; i < (limit ?? files.length); i++) {
			const file = files.item(i);

			if (file) fileArray.push(file);
		}

		setUploadingList((state) => {
			const mappedFiles: UploadingFile[] = fileArray.map((item, i) => ({
				file: item,
				loading: false,
				filename: null,
				order: i,
			}));
			return [...state, ...mappedFiles];
		});

		// Reset value to force update on change handler...
		e.target.value = "";
	}

	const onUploadingStart = useCallback((file: File) => {
		setUploadingList(
			produce((draft) => {
				draft.forEach((draftItem) => {
					if (draftItem.file === file) {
						draftItem.loading = true;
					}
				});
			}),
		);
	}, []);

	const onUploadingEnd = useCallback(
		(file: File, { filename, size, type }: UploadingEndData) => {
			setUploadingList(
				produce((draft) => {
					draft.forEach((draftItem) => {
						if (draftItem.file === file) {
							draftItem.loading = false;
							draftItem.filename = filename;
							draftItem.size = size;
							draftItem.type = type;
						}
					});
				}),
			);
		},
		[],
	);

	const onUploadingError = useCallback((file: File) => {
		setUploadingList(
			produce((draft) => {
				draft = draft.filter((item) => item.file !== file);
				return draft;
			}),
		);
	}, []);

	const onRemove = useCallback((filename: string) => {
		setUploadingList(
			produce((draft) => {
				draft = draft.filter((item) => item.filename !== filename);
				return draft;
			}),
		);
	}, []);

	useEffect(() => {
		uploadingList.forEach(({ file, loading, filename }) => {
			if (!filename && !loading) {
				onUploadingStart(file);

				const formData = new FormData();
				formData.append("file", file);

				if (file.name) {
					formData.append("filename", file.name.toString());
				}

				uploadFile(formData)
					.then((data) => {
						if (!data.result) {
							return onUploadingError(file);
						}
						return onUploadingEnd(file, {
							filename: data.result.filename,
							size: data.result.size,
							type: data.result.type,
						});
					})
					.catch(() => {
						onUploadingError(file);
					});
			}
		});
	}, [onUploadingEnd, onUploadingError, onUploadingStart, uploadingList]);

	useEffect(() => {
		if (!onChange) {
			return;
		}

		onChange(
			uploadingList.map((state, i) => ({
				loading: state.loading,
				filename: state.filename,
				size: state.size,
				order: i,
				type: getMediaType(state.file.type),
			})),
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uploadingList]);

	const isUploading = !!uploadingList.find((item) => item.loading);

	return (
		<div className="mt-8 flex flex-grow flex-col gap-4 rounded-md">
			<div className="flex w-fit flex-col items-start rounded-lg bg-[#F2F1F0] p-6">
				<h2 className="m-0 text-xl font-semibold">Загрузка медиа</h2>
				<p className="mt-2 text-base text-dark/80">
					Добавьте несколько изображений PNG, JPEG
				</p>

				<label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl bg-dark p-4 text-white">
					<div className="flex flex-row items-center">
						{isUploading && <Loading />}
						<p className="m-0 flex flex-row items-center justify-center font-medium">
							Выберите файлы для загрузки
						</p>
					</div>
					<input
						type="file"
						hidden
						onChange={handleChange}
						multiple
					/>
				</label>
			</div>

			<div className="flex flex-col rounded-lg bg-[#F2F1F0] p-4">
				<div className="card-heading">Медиа:</div>
				{uploadingList.length > 0 && (
					<div className="grid w-full grid-cols-upload-layout grid-rows-upload-layout gap-2 rounded-lg bg-white p-4">
						{uploadingList.map((item, index) => {
							if (item.loading) {
								return <UploadingFile key={index} />;
							}
							if (item.type === "Image" && item.filename)
								return (
									<div
										className="relative flex flex-col"
										key={item.filename}
									>
										<ImagePreview
											src={getMediaURL(item.filename)}
											alt={item.filename}
										/>
										<button
											className="absolute right-2 top-2 rounded-full border border-solid border-dark/10 bg-[#F2F1F0] p-0.5 hover:text-[tomato]"
											type="button"
											onClick={() =>
												item.filename &&
												onRemove(item.filename)
											}
										>
											<PiX className="text-base" />
										</button>
									</div>
								);
							if (item.type === "Video" && item.filename) {
								return (
									<div
										className="relative flex flex-col"
										key={item.filename}
									>
										<VideoPreview
											src={getMediaURL(item.filename)}
										/>
										<button
											className="absolute right-2 top-2 rounded-full border border-solid border-dark/10 bg-[#F5F6FA] p-0.5 hover:text-[tomato]"
											type="button"
											onClick={() =>
												item.filename &&
												onRemove(item.filename)
											}
										>
											<PiX className="text-base" />
										</button>
									</div>
								);
							}
						})}
					</div>
				)}
				{uploadingList.length === 0 && (
					<p className="text-base text-dark/80">
						Нет добавленных медиа файлов
					</p>
				)}
			</div>
		</div>
	);
};

export default Uploader;
