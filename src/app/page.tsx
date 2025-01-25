'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [text, setText] = useState('PDF');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prevText) => (prevText === 'PDF' ? 'Image' : 'PDF'));
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'authenticated') {
    return null; // Don't render this page if the user is authenticated
  }

  return (
    <main className="relative flex flex-col min-w-[100vw] justify-center flex-grow container mx-auto p-4 text-center"
      style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <h1 className="text-white text-5xl font-bold">
          Get Smart Summaries from <span className={`animated-text ${text === 'PDF' ? 'slide-in' : 'slide-out'}`}>{text}</span> files
        </h1>
        <div className="flex justify-center mt-8">
          <div className="flex space-x-4">
            <Link href="api/auth/signin" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
              Log In
            </Link>
            <Link href="/auth/signup" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <p className="text-white text-sm mt-4 md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
        &copy; {currentYear} Summary Generator. All rights reserved.
      </p>
    </main>
  );
}