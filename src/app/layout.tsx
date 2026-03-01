import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import OfflineBanner from "@/components/OfflineBanner";
import ClientProviders from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#080808",
};

export const metadata: Metadata = {
  title: "Endura — Take Control of Your Confidence",
  description:
    "Your private AI therapist for lasting sexual wellness. Evidence-based. Judgment-free. Completely confidential.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Endura",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <AnimatedBackground />
        <OfflineBanner />
        <ClientProviders />
        {children}
      </body>
    </html>
  );
}
