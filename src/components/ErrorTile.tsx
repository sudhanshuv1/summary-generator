import React from 'react';
import { FiXCircle } from 'react-icons/fi';

interface ErrorProps {
  message: string;
}

const ErrorTile: React.FC<ErrorProps> = ({ message }) => {
  return (
      <div className="bg-white border border-gray-500 rounded-lg p-6 shadow-lg text-center">
        <FiXCircle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-2xl text-gray-700">Error</p>
        <p className="text-gray-700 text-lg">{message}</p>
      </div>
  );
};

export default ErrorTile;