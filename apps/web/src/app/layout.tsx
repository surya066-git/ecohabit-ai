import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

export const metadata: Metadata = {
  title: "EcoHabit AI",
  description: "Carbon footprint awareness, habit tracking, goals, reports, and AI recommendations."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
