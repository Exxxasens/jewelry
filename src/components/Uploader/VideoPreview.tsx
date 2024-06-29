const VideoPreview: React.FC<React.HTMLProps<HTMLVideoElement>> = ({
	src,
	...rest
}) => {
	return (
		<video
			width="320"
			height="320"
			controls
			controlsList="nodownload"
			preload="none"
			{...rest}
		>
			<source src={src} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
};

export default VideoPreview;
