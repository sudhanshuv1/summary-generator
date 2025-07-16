'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSummary } from '../../../context/SummaryProvider';

const Dashboard = () => {
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { file, setFile, setSummaryLength } = useSummary();

  useEffect(() => {
    setFile(null); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSummarize = () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setError('');

    router.push('/dashboard/summary');
  };

  return (
    <>
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Upload a document to get the summary</h1>
      <div className="mt-8 w-4/6 mx-auto flex flex-col items-center">
        <div className="mb-4 w-full">
          <label htmlFor="fileInput" className="block text-white m-1 font-bold">Upload PDF/Image</label>
          <input
            type="file"
            id="fileInput"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="mt-1 p-2 bg-white text-gray-700 hover:cursor-pointer focus:outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="summaryLength" className="block text-white m-1 font-bold">Summary Length</label>
          <select
            className="w-full p-2 border border-gray-300 hover:cursor-pointer text-gray-700 rounded"
            defaultValue="100"
            onChange={(e) => setSummaryLength(Number(e.target.value))}
          >
            <option value="100">Short</option>
            <option value="250">Medium</option>
            <option value="500">Long</option>
          </select>
        </div>
        <button
          onClick={handleSummarize}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Get Summary
        </button>
        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;