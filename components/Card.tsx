import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className, title }: CardProps) {
  return (
    <div className={cn("rounded border border-neutral-800 bg-neutral-900", className)}>
      {title && (
        <div className="border-b border-neutral-800 px-4 py-3">
          <h3 className="text-sm font-medium text-neutral-200">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

