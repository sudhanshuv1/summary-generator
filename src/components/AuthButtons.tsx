'use client'

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Avatar from './Avatar';

const homepageUrl = process.env.HOMEPAGE_URL;

export const AuthButtons = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null; // Show nothing while loading
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: homepageUrl });
  };

  if (!session) {
    return (
      <div className="flex space-x-4">
        <Link href="/auth/signup" className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-gray-900">
          Sign Up
        </Link>
        <Link href="/api/auth/signin" className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-gray-900">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {session.user?.image ? (
        <Image
          src={session.user.image}
          alt="User Avatar"
          width={40}
          height={40}
          className="block w-10 h-10 rounded-full"
        />
      ) : (
        <Avatar letter={session.user?.name?.[0] || ''} />
      )}
      <button
        onClick={handleSignOut}
        className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-gray-900"
      >
        Sign Out
      </button>
    </div>
  );
};