"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "./layouts/auth-layout";
import { OrgSelectionView } from "./views/org-seletion-view";

export const OrganizationGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <AuthLayout>
        <OrgSelectionView />
      </AuthLayout>
    );
  }
  return <div>{children}</div>;
};
