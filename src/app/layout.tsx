import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { CircleProvider } from "@/contexts/CircleContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "SmartVault — Smart Wallet on Arc Network",
  description: "Smart multichain wallet on Arc Network. Send, bridge, and manage USDC across chains with passkey security.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} antialiased`}>
        <CircleProvider>
          {children}
        </CircleProvider>
      </body>
    </html>
  );
}
