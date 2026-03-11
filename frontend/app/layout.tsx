import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthGuard } from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "UrbEco",
  description: "Global environmental impact assessment and sustainability index for cities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-50`}
      >
        <AuthProvider>
          <AuthGuard>
            <Navigation />
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
