import { SignalStatus } from "@/types";
import { cn } from "@/lib/cn";
import { TrendingUp, TrendingDown, Minus, Circle } from "lucide-react";

interface SignalIndicatorProps {
  status: SignalStatus;
  className?: string;
}

export function SignalIndicator({ status, className }: SignalIndicatorProps) {
  if (status === "none") {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs text-neutral-600", className)}>
        <Circle className="h-2.5 w-2.5" />
        <span>—</span>
      </span>
    );
  }

  const config = {
    positive: {
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      label: "Positive",
    },
    neutral: {
      icon: Minus,
      color: "text-neutral-500",
      bgColor: "bg-neutral-500/10",
      label: "Neutral",
    },
    negative: {
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: "Negative",
    },
  };

  const { icon: Icon, color, bgColor, label } = config[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("inline-flex items-center justify-center p-0.5", bgColor)}>
        <Icon className={cn("h-2.5 w-2.5", color)} />
      </span>
      <span className="text-xs text-neutral-500">{label}</span>
    </span>
  );
}

