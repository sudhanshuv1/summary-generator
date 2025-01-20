'use client'

import React from 'react'
import { useState, useRef, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { signIn } from 'next-auth/react';

export default function Page() {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({email, name, password}),
      headers: {'Content-Type': 'application/json'},
    });
    if (!response.ok) {
      setError(response.statusText);
    }
    else {
      // Sign In automatically
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
  
      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to the dashboard or another page
        window.location.href = '/dashboard';
      }
    }
  };

  return (
      <>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-gray-700">
            <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              ref = {inputRef}
              className="mt-1 p-2 block w-full h-10 outline-none rounded-md border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4 text-gray-700">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 p-2 block w-full h-10 outline-none rounded-md border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-8 relative text-gray-700">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 block w-full h-10 outline-none rounded-md border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <div
              className="absolute inset-y-0 right-0 pr-2 pt-6 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="cursor-pointer" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </>
  );
};

