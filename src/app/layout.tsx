import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { CircleProvider } from "@/contexts/CircleContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartVault — Smart Wallet on Arc Network",
  description:
    "Smart multichain wallet on Arc Network. Send, bridge, and manage USDC across chains with passkey security.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body className="antialiased bg-[#0a0d14]">
        <CircleProvider>
          {children}
        </CircleProvider>
      </body>
    </html>
  );
}
