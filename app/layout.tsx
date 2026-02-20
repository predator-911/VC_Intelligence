import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { GlobalSearch } from "@/components/GlobalSearch";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VC Intelligence",
  description: "Venture capital intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-neutral-950">
          <Sidebar />
          <div className="ml-64 flex flex-1 flex-col">
            <header className="flex h-16 items-center gap-4 border-b border-neutral-800 bg-neutral-900 px-6">
              <GlobalSearch />
            </header>
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

