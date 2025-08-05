import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
