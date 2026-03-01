// Simple in-memory rate limiter (sliding window)
// For production at scale, replace with Redis or Supabase-based rate limiting

const requests = new Map<string, number[]>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute per user

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = requests.get(userId) ?? [];

  // Remove requests outside the window
  const validRequests = userRequests.filter((t) => now - t < WINDOW_MS);

  if (validRequests.length >= MAX_REQUESTS) {
    requests.set(userId, validRequests);
    return false;
  }

  validRequests.push(now);
  requests.set(userId, validRequests);
  return true;
}

// Periodic cleanup to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [userId, times] of requests.entries()) {
      const valid = times.filter((t) => now - t < WINDOW_MS);
      if (valid.length === 0) {
        requests.delete(userId);
      } else {
        requests.set(userId, valid);
      }
    }
  }, 60_000);
}
