"use client"

import { cn } from "@workspace/ui/lib/utils"


interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "relative inline-block",
        size === "sm" && "h-3 w-3",
        size === "md" && "h-4 w-4",
        size === "lg" && "h-6 w-6",
        size === "xl" && "h-8 w-8",
        size === "2xl" && "h-10 w-10",
        size === "3xl" && "h-12 w-12",
        size === "4xl" && "h-16 w-16",
        size === "5xl" && "h-20 w-20",
        className
      )}
      {...props}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="spinner-blade" />
      ))}
    </div>
  )
}