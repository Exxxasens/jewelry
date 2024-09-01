import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

const AdminLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
	const session = await getServerSession();

	if (session?.user) {
		return redirect("/dashboard");
	}

	return (
		<SessionProvider>
			<div className="flex h-full min-h-[100vh] w-full items-center justify-center">
				{children}
			</div>
		</SessionProvider>
	);
};

export default AdminLayout;
