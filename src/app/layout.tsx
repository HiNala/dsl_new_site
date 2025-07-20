import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PillNavigation } from "@/components/PillNavigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSL New Site",
  description: "Modern Next.js application with 3D Spline hero section",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PillNavigation />
        {children}
      </body>
    </html>
  );
}
