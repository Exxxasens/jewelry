import { useSortable } from "@dnd-kit/sortable";
import ImagePreview from "./ImagePreview";
import getMediaURL from "~/utils/getImageURL";
import VideoPreview from "./VideoPreview";
import LoadingFile from "./LoadingFile";
import { PiDotsSixVerticalBold, PiX } from "react-icons/pi";
import { CSS } from "@dnd-kit/utilities";
import { type LoadedFile } from ".";

export interface SortableMediaItemProps
	extends Omit<LoadedFile, "size" | "order"> {
	id: string;
	filename: string;
	onRemove: (filename: string) => void;
}

// id: string;
// order: number;
// filename: string | null;
// loading: boolean;
// file?: File;
// size?: number;
// type?: MediaType;

const SortableMediaItem: React.FC<SortableMediaItemProps> = ({
	id,
	filename,
	loading,
	type,
	onRemove,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	if (loading) {
		return <LoadingFile key={id} />;
	}

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			className="relative"
			ref={setNodeRef}
			style={style}
			{...attributes}
		>
			{type === "Image" && (
				<>
					<div
						className="flex h-full w-full flex-col"
						{...listeners}
						key={filename}
					>
						<ImagePreview
							src={getMediaURL(filename)}
							alt={filename}
						/>
					</div>
					<button
						className="absolute right-2 top-2 rounded-full border border-solid border-dark/10 bg-[#F2F1F0] p-0.5 hover:text-[tomato]"
						type="button"
						onClick={() => filename && onRemove(filename)}
					>
						<PiX className="text-base" />
					</button>
				</>
			)}
			{type === "Video" && (
				<>
					<div className="flex h-full w-full flex-col" key={filename}>
						<VideoPreview src={getMediaURL(filename)} />
					</div>
					<button
						className="absolute right-2 top-2 rounded-full border border-solid border-dark/10 bg-[#F5F6FA] p-0.5 hover:text-[tomato]"
						type="button"
						onClick={() => filename && onRemove(filename)}
					>
						<PiX className="text-base" />
					</button>
					<button
						className="button-base absolute left-2 top-2 border border-solid border-dark/10 bg-white p-1 text-xl text-dark"
						type="button"
						{...listeners}
					>
						<PiDotsSixVerticalBold />
					</button>
				</>
			)}
		</div>
	);
};

export default SortableMediaItem;
