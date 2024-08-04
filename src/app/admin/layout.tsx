const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex h-full min-h-[100vh] w-full items-center justify-center">
			{children}
		</div>
	);
};

export default AdminLayout;
