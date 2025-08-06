


import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, ArrowUp, Check } from "lucide-react";

interface ConversationStatusIconProps {
  status: "unresolved" | "resolved" | "escalated";
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: Check,
    bgColor: "bg-[#3fb62f]",
  },
  unresolved: {
    icon: ArrowRight,
    bgColor: "bg-destructive",
  },
  escalated: {
    icon: ArrowUp,
    bgColor: "bg-yellow-500",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
  className
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full size-5",
        config.bgColor,
        className
      )}
    >
      <Icon className="size-3 stroke-3 text-white" />
    </div>
  );
};
