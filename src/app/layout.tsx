import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  weight: ['300', '500'],          // 300 = thin, 500 = nav strip
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',        // exposes a CSS variable
});

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
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-gray-50 text-brand-blue">
        {children}
      </body>
    </html>
  );
}
