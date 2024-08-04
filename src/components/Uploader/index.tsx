"use client";

import { type ChangeEvent, useState, useEffect, useCallback } from "react";
import { produce } from "immer";
import Loading from "../Loading";
import { uploadFile } from "~/app/actions/actions";
import getMediaType from "~/lib/getMediaType";
import { type MediaType } from "@prisma/client";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableMediaItem from "./SortableMediaItem";
import { v4 as uuidv4 } from "uuid";

export interface LoadedFile {
	order: number;
	filename: string;
	loading: boolean;
	size?: number;
	type?: MediaType;
}

export interface FileItem extends Omit<LoadedFile, "filename"> {
	id: string;
	order: number;
	filename: string | null;
	loading: boolean;
	file?: File;
}

type UploadingEndData = {
	filename: string;
	size: number;
	type: MediaType;
};

function filterUploaded(
	file: FileItem,
): file is LoadedFile & { id: string; file?: File } {
	if (file.filename) {
		return true;
	}
	return false;
}

export interface UploaderProps {
	allowUpload?: boolean;
	limit?: number;
	defaultValue?: Omit<LoadedFile, "id">[];
	onChange?: (value: LoadedFile[]) => void;
}

const Uploader: React.FC<UploaderProps> = ({
	allowUpload = true,
	limit,
	onChange,
	defaultValue,
}) => {
	const [uploadingList, setUploadingList] = useState<FileItem[]>(
		defaultValue?.map((value) => ({
			...value,
			id: value.filename,
		})) ?? [],
	);

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
			const mappedFiles: FileItem[] = fileArray.map((item, i) => {
				return {
					id: uuidv4().toString(),
					file: item,
					loading: false,
					filename: null,
					order: i,
				};
			});
			return [...state, ...mappedFiles];
		});

		// Reset value to force update on change handler...
		e.target.value = "";
	}

	const onUploadingStart = useCallback((file: File) => {
		setUploadingList(
			produce((draft) => {
				const foundItem = draft.find((item) => item.file === file);
				if (foundItem) foundItem.loading = true;
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

	const upload = useCallback(
		async function upload(file: File) {
			onUploadingStart(file);
			const formData = new FormData();
			formData.append("file", file);
			if (file.name) {
				formData.append("filename", file.name.toString());
			}

			try {
				const data = await uploadFile(formData);
				if (!data.result) {
					return onUploadingError(file);
				}
				return onUploadingEnd(file, {
					filename: data.result.filename,
					size: data.result.size,
					type: data.result.type,
				});
			} catch (error) {
				console.log(error);
				return onUploadingError(file);
			}
		},
		[onUploadingEnd, onUploadingError, onUploadingStart],
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setUploadingList(
				produce((items) => {
					const oldIndex = items.findIndex(
						(item) => item.id === active.id,
					);
					const newIndex = items.findIndex(
						(item) => item.id === over.id,
					);

					if (newIndex === 0 && items[oldIndex]?.type === "Video") {
						console.log(items[oldIndex].type, "oldIndex");
						return;
					}

					if (oldIndex === 0 && items[newIndex]?.type === "Video") {
						console.log(items[newIndex].type, "newIndex");
						return;
					}

					return arrayMove(items, oldIndex, newIndex);
				}),
			);
		}
	}

	useEffect(() => {
		uploadingList.forEach((item) => {
			if (item.loading === false && item.file && !item.filename) {
				void upload(item.file);
			}
		});
	}, [upload, uploadingList]);

	useEffect(() => {
		if (!onChange) {
			return;
		}
		onChange(
			uploadingList.filter(filterUploaded).map((state, i) => {
				const type = state.type
					? state.type
					: state.file
						? getMediaType(state.file.type)
						: undefined;
				return {
					loading: state.loading,
					filename: state.filename,
					size: state.size,
					order: i,
					type,
				};
			}),
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uploadingList]);

	const isUploading = !!uploadingList.find((item) => item.loading);
	const sortableMediaList = uploadingList.filter(filterUploaded);

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
					<div className="auto-rows-upload-layout grid w-full grid-cols-upload-layout gap-2 rounded-lg bg-white p-4">
						<DndContext onDragEnd={handleDragEnd}>
							<SortableContext items={uploadingList}>
								{sortableMediaList.map((item) => (
									<SortableMediaItem
										key={item.id}
										id={item.id}
										filename={item.filename}
										loading={item.loading}
										type={item.type}
										onRemove={onRemove}
									/>
									// id: string;
									// order: number;
									// filename: string | null;
									// loading: boolean;
									// file?: File;
									// size?: number;
									// type?: MediaType;
								))}
							</SortableContext>
						</DndContext>
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
