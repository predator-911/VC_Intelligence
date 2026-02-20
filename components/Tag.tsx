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
        "inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs font-normal text-neutral-400",
        className
      )}
    >
      {children}
    </span>
  );
}

