import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { getFCMToken } from "./firebase";

export async function registerPushNotifications(
  userId: string
): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    return registerNativePush(userId);
  }
  return registerWebPush(userId);
}

async function registerNativePush(userId: string): Promise<boolean> {
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== "granted") return false;

  await PushNotifications.register();

  return new Promise((resolve) => {
    PushNotifications.addListener("registration", async (token) => {
      await saveToken(userId, token.value, "ios");
      resolve(true);
    });
    PushNotifications.addListener("registrationError", () => {
      resolve(false);
    });
  });
}

async function registerWebPush(userId: string): Promise<boolean> {
  if (!("Notification" in window)) return false;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const token = await getFCMToken();
  if (!token) return false;

  await saveToken(userId, token, "web");
  return true;
}

async function saveToken(
  userId: string,
  token: string,
  platform: "ios" | "web"
): Promise<void> {
  await fetch("/api/notifications/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, token, platform }),
  });
}

export async function unregisterPushNotifications(
  userId: string
): Promise<void> {
  await fetch("/api/notifications/register", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}
