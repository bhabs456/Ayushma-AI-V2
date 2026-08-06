import type { Metadata } from "next";
import "./globals.css";
import SplashCursor from "@/react-bits/SplashCursor";

export const metadata: Metadata = {
  title: "Ayushman-AI | Clinical Knowledge & Traceable RAG",
  description: "Traceable clinical AI where every answer maps to verified document sources.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.ico", sizes: "96x96" },
      { url: "/favicon.ico", sizes: "128x128" },
      { url: "/favicon.ico", sizes: "256x256" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark font-sans">
      <body className="min-h-full flex flex-col bg-[var(--void)] text-[var(--ink)]">
        <SplashCursor
          DENSITY_DISSIPATION={8.0}
          SPLAT_RADIUS={0.055}
          RAINBOW_MODE={false}
          COLOR="#10B981"
        />
        {children}
      </body>
    </html>
  );
}

