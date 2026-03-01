import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

function getFirebaseMessaging(): Messaging | null {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) return null;
  if (messaging) return messaging;
  try {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    return messaging;
  } catch {
    return null;
  }
}

export async function getFCMToken(): Promise<string | null> {
  const msg = getFirebaseMessaging();
  if (!msg) return null;
  try {
    const token = await getToken(msg, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch {
    return null;
  }
}
