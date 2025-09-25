import type { Metadata } from "next";
import { Header } from "./Header";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import site from "@/data/site.json";

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
  const contactLinks = ((site as unknown as { contact?: { links?: Record<string, string> } }).contact?.links) || {};
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 container mx-auto w-full py-8">{children}</main>
        <footer className="border-t border-white/10">
          <div className="container py-6 text-sm flex items-center justify-between">
            <span>© {new Date().getFullYear()} Gaston Ibarroule</span>
            <div className="flex gap-4">
              {contactLinks.linkedin ? (
                <a href={contactLinks.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
              ) : null}
              {contactLinks.instagram ? (
                <a href={contactLinks.instagram} target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>
              ) : null}
              {contactLinks.imdb ? (
                <a href={contactLinks.imdb} target="_blank" rel="noreferrer" className="hover:underline">IMDb</a>
              ) : null}
              {contactLinks["crew-united"] ? (
                <a href={contactLinks["crew-united"]} target="_blank" rel="noreferrer" className="hover:underline">Crew United</a>
              ) : null}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
