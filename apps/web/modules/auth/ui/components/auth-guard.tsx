"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { AuthLayout } from "./layouts/auth-layout";
import { SignInViewPage } from "./views/sign-in-view";
import { Loader } from "@workspace/ui/components/shared/loader";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <Loader size="2xl" fullScreen />
        </AuthLayout>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInViewPage />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};
