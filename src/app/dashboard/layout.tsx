"use server";

import { getServerSession } from "next-auth";
import { redirect, RedirectType } from "next/navigation";
import ContextMenu from "~/components/ContextMenu/ContextMenu";
import { ContextMenuProvider } from "~/components/ContextMenu/ContextMenuProvider";
import Sidebar from "~/components/Dashboard/Sidebar";

const DashboardSidebarLayout: React.FC<React.PropsWithChildren> = async ({
	children,
}) => {
	const session = await getServerSession();

	if (!session?.user) {
		redirect(`/admin/login`, RedirectType.push);
	}

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
