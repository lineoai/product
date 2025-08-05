"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton, OrganizationSwitcher } from "@clerk/nextjs";



export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);
  return (
    <>
      <Authenticated>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <p>Hello Apps / Web</p>
          <UserButton />
          <OrganizationSwitcher />
          <Button onClick={() => addUser()}>Add</Button>
        </div>
      </Authenticated>
      <Unauthenticated>
        <p>
          Must be Signed In
          <SignInButton />
        </p>
      </Unauthenticated>
    </>
  );
}
