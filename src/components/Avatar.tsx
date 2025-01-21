import React from 'react';

interface AvatarProps {
  letter: string;
  backgroundColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({ letter } ) => {
  return (
    <div
      className="flex items-center justify-center text-lg font-bold w-10 h-10 rounded-full bg-fuchsia-900"
    >
      <span className="text-white">{letter.toLocaleUpperCase()}</span>
    </div>
  );
};

export default Avatar;