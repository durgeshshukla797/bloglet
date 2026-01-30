import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`
        bg-dark-card/50 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden
        ${hover ? 'hover:translate-y-[-4px] hover:shadow-xl hover:border-primary-500/30 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
