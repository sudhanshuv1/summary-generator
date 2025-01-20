import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "../context/AuthProvider";
import { AuthButtons } from "../components/AuthButtons";
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
  title: "Summary Generator",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen w-[100vw]">
          <header className="bg-blue-600 text-white p-4 hidden md:block">
            <nav className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
              <a className="text-2xl font-bold mb-4 sm:mb-0" href="/">Summary Generator</a>
              <div className="space-x-4 flex">
                <AuthButtons />
              </div>
            </nav>
          </header>
            {children}
          <footer className="hidden md:block bg-blue-600 text-white p-4">
            <div className="container mx-auto text-center">
              <p>&copy; {new Date().getFullYear()} Summary Generator. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
    </AuthProvider>
  );
}