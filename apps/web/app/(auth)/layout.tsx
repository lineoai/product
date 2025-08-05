import { AuthLayout } from "@/modules/auth/ui/components/layouts/auth-layout";
import { siteConfig } from "@/modules/config/site";
import { Metadata } from "next";

export const metadata : Metadata ={
  title: siteConfig.auth.title,
  description: siteConfig.auth.description,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
