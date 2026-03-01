"use client";

import { useEffect } from "react";
import { initCapacitor } from "@/lib/capacitor";
import { initAnalytics } from "@/lib/analytics";

export default function ClientProviders() {
  useEffect(() => {
    initCapacitor();
    initAnalytics();
  }, []);

  return null;
}
