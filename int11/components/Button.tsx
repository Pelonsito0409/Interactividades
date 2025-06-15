
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseStyle = "font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-150 ease-in-out";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-400 text-white';
      break;
    case 'secondary':
      variantStyle = 'bg-slate-600 hover:bg-slate-700 focus:ring-slate-500 text-slate-100';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyle = 'px-4 py-2 text-base';
      break;
    case 'lg':
      sizeStyle = 'px-6 py-3 text-lg';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className || ''} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
    