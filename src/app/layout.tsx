import type { Metadata } from "next";
import { Geist, Geist_Mono, Special_Elite } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const detectiveFont = Special_Elite({
  variable: "--font-detective",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Detective",
  description: "A narrative SQL mystery — learn SELECT, WHERE, and ORDER BY by solving a case.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${detectiveFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
