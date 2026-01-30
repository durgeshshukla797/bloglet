import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 focus:ring-primary-500',
    secondary: 'bg-dark-card hover:bg-slate-700 text-white border border-slate-700 focus:ring-slate-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500/10 focus:ring-primary-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5 focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <ImSpinner2 className="animate-spin mr-2" />}
      {children}
    </button>
  );
};

export default Button;
