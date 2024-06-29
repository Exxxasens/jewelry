import Image from "next/image";

interface ImagePreviewProps {
    src: string;
    alt: string;
    onRemove?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, onRemove }) => {
    return (
        <div className="flex h-32" onClick={onRemove}>
            <Image
                className="h-full w-full rounded-lg object-cover"
                width={256}
                height={256}
                src={src}
                alt={alt}
            />
        </div>
    );
};

export default ImagePreview;
