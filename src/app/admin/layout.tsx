import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AdminLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
	const session = await getServerSession();

	if (session?.user) {
		return redirect("/dashboard");
	}

	return (
		<div className="flex h-full min-h-[100vh] w-full items-center justify-center">
			{children}
		</div>
	);
};

export default AdminLayout;
