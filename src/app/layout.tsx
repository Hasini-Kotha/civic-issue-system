import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Civic Issue Reporting System",
  description: "Report, track, and manage civic issues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-xs text-white">CR</span>
              Civic Reporter
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-xl px-3 py-2 text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/submit"
                className="rounded-xl px-3 py-2 text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
              >
                Submit
              </Link>
              <Link
                href="/admin"
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                Admin
              </Link>
              <LogoutButton />
            </div>
          </nav>
        </header>
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </body>
    </html>
  );
}
