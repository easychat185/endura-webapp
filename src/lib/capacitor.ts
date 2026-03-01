import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export async function initCapacitor(): Promise<void> {
  if (!isNative()) return;
  await StatusBar.setStyle({ style: Style.Dark });
  await StatusBar.setBackgroundColor({ color: "#080808" });
}

export async function hapticLight(): Promise<void> {
  if (!isNative()) return;
  await Haptics.impact({ style: ImpactStyle.Light });
}
