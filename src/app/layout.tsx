import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhilFIDA | IT Ticketing System",
  description: "Your local PhilFIDA IT workspace. Manage employee requests, track repairs, and print agency support reports. No accounts required.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
