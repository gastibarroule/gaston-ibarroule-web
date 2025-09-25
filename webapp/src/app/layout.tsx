import type { Metadata } from "next";
import { Header } from "./Header";
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
        <Header />
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
