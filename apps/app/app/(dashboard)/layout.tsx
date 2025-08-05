
import { siteConfig } from "@/modules/config/site";
import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.dashboard.title,
  description: siteConfig.dashboard.description,
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};
export default Layout;
