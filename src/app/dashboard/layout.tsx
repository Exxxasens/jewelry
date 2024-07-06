import ContextMenu from "~/components/ContextMenu/ContextMenu";
import { ContextMenuProvider } from "~/components/ContextMenu/ContextMenuProvider";
import Sidebar from "~/components/Dashboard/Sidebar";

const DashboardSidebarLayout: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return (
		// TODO: color theme
		<div className="flex max-h-screen flex-row overflow-auto">
			<ContextMenuProvider>
				<Sidebar />
				<div className="flex w-full flex-col p-8">{children}</div>
				<ContextMenu />
			</ContextMenuProvider>
		</div>
	);
};

export default DashboardSidebarLayout;
