import Sidebar from "~/components/Dashboard/Sidebar";

export interface DashboardSidebarLayoutProps
  extends React.HTMLProps<HTMLDivElement> {
  heading?: string;
}

const DashboardSidebarLayout: React.FC<DashboardSidebarLayoutProps> = ({
  children,
  className = "",
  heading,
  ...rest
}) => {
  return (
    // TODO: color theme
    <div className="flex max-h-screen flex-row overflow-auto">
      <Sidebar />
      <div className="flex w-full flex-col p-8">
        {heading && <h1 className="mb-8 w-full">{heading}</h1>}
        <div className={`flex w-full flex-col ${className}`} {...rest}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarLayout;
