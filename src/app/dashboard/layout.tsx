import Sidebar from "~/components/Dashboard/Sidebar";

const DashboardSidebarLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        // TODO: color theme
        <div className="flex max-h-screen flex-row overflow-auto">
            <Sidebar />
            <div className="flex w-full flex-col p-8">{children}</div>
        </div>
    );
};

export default DashboardSidebarLayout;
