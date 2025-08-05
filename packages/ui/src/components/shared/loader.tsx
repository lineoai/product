import { Spinner } from "@workspace/ui/components/shared/spinner";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  fullScreen?: boolean;
}

export function Loader({
  className,
  size = "lg",
  fullScreen = false,
  ...props
}: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center gap-4 ${fullScreen ? "w-full min-h-screen h-full" : ""}`}
      {...props}
    >
      <Spinner size={size} />
    </div>
  );
}
