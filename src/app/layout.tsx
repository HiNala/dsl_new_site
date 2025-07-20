import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap"
        />
      </head>
      <body className="font-inter font-light bg-[#F5F7FA]" style={{
        '--brand-blue': '#0D4CFF',
        '--font-nav-weight': '500',
        '--font-headline-weight': '300'
      } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
