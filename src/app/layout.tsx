import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Togethr - AI-Moderated Group Therapy",
  description: "Connect with others experiencing similar challenges in safe, anonymous group therapy sessions moderated by AI.",
  keywords: ["mental health", "group therapy", "AI moderation", "anonymous", "support"],
  authors: [{ name: "Togethr Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-slate-50 to-blue-50 antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
