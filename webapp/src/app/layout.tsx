import type { Metadata } from "next";
import Link from "next/link";
import { HeaderClient } from "./HeaderClient";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Home",
  description: "Responsive portfolio with projects, about, and contact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-10 header-bleed backdrop-saturate-150 backdrop-blur">
          <div className="container h-16 flex items-center justify-between">
            <Link href="/" className="font-bold tracking-wide inline-block uppercase text-xl">Gaston Ibarroule</Link>
            <nav className="hidden md:flex items-center gap-5 text-base">
              <Link href="/projects" className="opacity-90 hover:opacity-100 px-3 py-2 rounded-[30px] fx-enter">Projects</Link>
              <Link href="/about" className="opacity-90 hover:opacity-100 px-3 py-2 rounded-[30px] fx-enter">About</Link>
              <Link href="/contact" className="opacity-90 hover:opacity-100 px-3 py-2 rounded-[30px] fx-enter">Contact</Link>
            </nav>
            <HeaderClient />
          </div>
        </header>
        <main className="flex-1 container mx-auto w-full py-8">{children}</main>
        <footer className="border-t border-white/10">
          <div className="container py-6 text-sm flex items-center justify-between">
            <span>© {new Date().getFullYear()} Gaston Ibarroule</span>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
