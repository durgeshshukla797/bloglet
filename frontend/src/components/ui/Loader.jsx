import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

const Loader = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className={`flex justify-center items-center w-full py-8 ${className}`}>
      <ImSpinner2 className={`animate-spin text-primary-500 ${sizes[size]}`} />
    </div>
  );
};

export default Loader;
