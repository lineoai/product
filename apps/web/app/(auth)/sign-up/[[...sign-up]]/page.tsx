import { SignUpViewPage } from "@/modules/auth/ui/components/views/sign-up-view";
import { siteConfig } from "@/modules/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.auth.signUp.title,
  description: siteConfig.auth.signUp.description,
};
export default function Page() {
  return <SignUpViewPage />;
}
