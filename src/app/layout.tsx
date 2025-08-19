import type { Metadata } from "next";
import "./globals.css";
import ScrollSnapManager from "@/components/ScrollSnapManager";

export const metadata: Metadata = {
  title: "Digital Studio Labs",
  description: "San Francisco-based venture studio investing in the creator economy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F8F9FA] text-[#4A90E2] cursor-auto" style={{
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}>
        <ScrollSnapManager />
        {children}
      </body>
    </html>
  );
}
