"use client";

import { Suspense } from "react";
import CompaniesClient from "./CompaniesClient";

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
      <CompaniesClient />
    </Suspense>
  );
}
