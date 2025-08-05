import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import { siteConfig } from "@/modules/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.dashboard.title,
  description: siteConfig.dashboard.description,
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <OrganizationGuard>{children}</OrganizationGuard>
    </AuthGuard>
  );
};
export default Layout;
