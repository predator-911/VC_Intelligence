import { cn } from "@/lib/cn";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "sector" | "stage";
  className?: string;
}

export function Tag({ children, variant = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        variant === "sector" && "bg-neutral-800 text-neutral-300",
        variant === "stage" && "bg-neutral-800 text-neutral-300",
        variant === "default" && "bg-neutral-800 text-neutral-300",
        className
      )}
    >
      {children}
    </span>
  );
}

