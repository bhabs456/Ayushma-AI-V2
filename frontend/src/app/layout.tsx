import type { Metadata } from "next";
import "./globals.css";
import SplashCursor from "@/react-bits/SplashCursor";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Ayushman-AI — Clinical Knowledge & Traceable RAG",
  description: "Traceable clinical AI where every answer maps to verified document sources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased dark", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-[var(--void)] text-[var(--ink)]">
        <SplashCursor
          DENSITY_DISSIPATION={3.0}
        />
        {children}
      </body>
    </html>
  );
}

