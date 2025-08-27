import DashboardSidebar from "./sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[auto_1fr]">
      <DashboardSidebar />
      <main className="p-4">{children}</main>
    </div>
  );
};
export default DashboardLayout;
