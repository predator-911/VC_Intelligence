"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, List, Bookmark, Search } from "lucide-react";
import { cn } from "@/lib/cn";

const navigation = [
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Lists", href: "/lists", icon: List },
  { name: "Saved", href: "/saved", icon: Bookmark },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-neutral-800 bg-neutral-900/95">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-neutral-800 px-6">
          <span className="text-sm font-semibold tracking-tight text-neutral-200">VC Intelligence</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 transition-smooth hover:bg-neutral-800/50 hover:text-neutral-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

