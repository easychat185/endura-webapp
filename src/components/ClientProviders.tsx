"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { initCapacitor } from "@/lib/capacitor";
import { initAnalytics, trackEvent } from "@/lib/analytics";

export default function ClientProviders() {
  useEffect(() => {
    initCapacitor();
    initAnalytics();
  }, []);

  useReportWebVitals((metric) => {
    trackEvent("web_vitals", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  });

  return null;
}
