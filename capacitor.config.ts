import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.endura.app",
  appName: "Endura",
  server: { url: "https://endura-app.vercel.app", cleartext: false },
  plugins: {
    SplashScreen: { launchAutoHide: true, androidScaleType: "CENTER_CROP" },
    StatusBar: { style: "DARK", backgroundColor: "#080808" },
    Keyboard: { resize: "body", resizeOnFullScreen: true },
  },
};

export default config;
