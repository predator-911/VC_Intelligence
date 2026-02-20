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
        "inline-flex items-center px-1.5 py-0.5 text-xs font-normal text-neutral-500",
        variant === "sector" && "bg-neutral-900 border border-neutral-800",
        variant === "stage" && "bg-neutral-900 border border-neutral-800",
        variant === "default" && "bg-neutral-900 border border-neutral-800",
        className
      )}
    >
      {children}
    </span>
  );
}

