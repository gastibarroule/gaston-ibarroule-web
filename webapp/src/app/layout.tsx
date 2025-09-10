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
  title: "Gaston Ibarroule – Sound Design Portfolio",
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
        <header className="sticky top-0 z-10 backdrop-saturate-150 backdrop-blur bg-[rgba(28,28,30,0.6)] border-b border-white/10">
          <div className="container-max mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold tracking-wide inline-block uppercase text-xl">Gaston Ibarroule</Link>
            <nav className="hidden md:flex items-center gap-5 text-base">
              <Link href="/projects" className="opacity-90 hover:opacity-100">Projects</Link>
              <Link href="/about" className="opacity-90 hover:opacity-100">About</Link>
              <Link href="/contact" className="opacity-90 hover:opacity-100">Contact</Link>
            </nav>
            <HeaderClient />
          </div>
        </header>
        <main className="flex-1 container-max mx-auto w-full px-6 py-8">{children}</main>
        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm flex items-center justify-between">
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
