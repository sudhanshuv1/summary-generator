import type { Metadata } from "next";
import "../globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Summary Generator",
  description: "Log in or Sign up to get started",
};

const currentYear = new Date().getFullYear();

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main 
      className="relative flex flex-col justify-center z-10 min-w-[100vw] flex-grow container mx-auto p-4 text-center max-h-[100vh]"
      style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 z-20 bg-black opacity-50"></div>
      <Link className="text-lg text-white z-30 ml-3 mr-auto hover:underline" href="/">
        Back to Home
      </Link>
      <div className="w-full max-w-md z-30 bg-white p-8 rounded-lg shadow-md m-auto">
        {children}
      </div>
      <p className="text-white text-sm mt-4 md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
        &copy; {currentYear} Summary Generator. All rights reserved.
      </p>
  </main>
  )
}
