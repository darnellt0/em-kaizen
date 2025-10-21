import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merri = Merriweather({ weight: ["700"], subsets: ["latin"], variable: "--font-merri" });

export const metadata: Metadata = {
  title: "Kaizen 1% Challenge — Elevated Movements",
  description: "A 7-day, 5-minute practice to get 1% better. Experience continuous improvement through tiny, consistent actions.",
  keywords: ["Kaizen", "continuous improvement", "habits", "1%", "advisory board"],
  openGraph: {
    title: "Kaizen 1% Challenge — Elevated Movements",
    description: "A 7-day, 5-minute practice to get 1% better.",
    type: "website",
    url: "https://kaizen.elevatedmovements.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaizen 1% Challenge — Elevated Movements",
    description: "A 7-day, 5-minute practice to get 1% better.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merri.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%2336013f'/><stop offset='100%25' stop-color='%23176161'/></linearGradient></defs><rect width='256' height='256' rx='48' fill='url(%23g)'/><path d='M64 160c32-48 64-48 96 0' fill='none' stroke='%23e0cd67' stroke-width='16' stroke-linecap='round'/><circle cx='96' cy='96' r='12' fill='%23e0cd67'/><circle cx='160' cy='96' r='12' fill='%23e0cd67'/></svg>" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
