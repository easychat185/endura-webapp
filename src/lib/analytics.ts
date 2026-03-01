import posthog from "posthog-js";

let initialized = false;

export function initAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    autocapture: false,
  });
  initialized = true;
}

export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
): void {
  if (!initialized) return;
  posthog.capture(event, properties);
}

export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>
): void {
  if (!initialized) return;
  posthog.identify(userId, traits);
}
