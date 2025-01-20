'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    if (result?.error) {
      setError(result.error);
    } else {
      // Redirect to the dashboard
      window.location.href = '/dashboard';
    }
  };

  const handleGithubSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn('github', {
      callbackUrl: '/dashboard',
    });
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <>
      <button
        onClick={(e) => handleGithubSignIn(e)}
        className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition-colors mb-4"
      >
        Continue with Github
      </button>
      <div className="flex items-center mb-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-gray-700">
          <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 w-full h-10 rounded-md shadow-sm border-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
          />
        </div>
        <div className="mb-6 text-gray-700 relative">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 w-full h-10 rounded-md shadow-sm border-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          Log In
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </>
  );
};

export default Page;