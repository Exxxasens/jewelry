import Image from "next/image";

interface ImagePreviewProps {
	src: string;
	alt: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt }) => {
	return (
		<Image
			className="h-full w-full rounded-lg object-cover"
			width={256}
			height={256}
			src={src}
			alt={alt}
		/>
	);
};

export default ImagePreview;
