import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cyber Shield Trainer | Interactive Cybersecurity Training",
  description:
    "A virtual security lab where you face realistic cyberattack simulations. Learn to identify threats, react correctly, and understand common vulnerabilities.",
  keywords: "cybersecurity, training, phishing simulator, login simulator, security score",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
