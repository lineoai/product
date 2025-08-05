import { OrgSelectionView } from "@/modules/auth/ui/components/views/org-seletion-view";
import { siteConfig } from "@/modules/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.auth.org.title,
  description: siteConfig.auth.org.description,
};

export default function Page() {
  return <OrgSelectionView />;
}
