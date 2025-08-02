import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

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
      <body className="bg-[#F8F9FA] text-[#4A90E2]" style={{
        fontFamily: '"Helvetica Neue", Arial, sans-serif'
      }}>
              <CustomCursor />
        {children}
      </body>
    </html>
  );
}
