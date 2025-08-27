import { auth } from "@/auth";
import { redirect } from "next/navigation";

import DashboardSidebar from "./sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=/dashboard`);
  }
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[auto_1fr]">
      <DashboardSidebar />
      <main className="p-4">{children}</main>
    </div>
  );
};
export default DashboardLayout;
