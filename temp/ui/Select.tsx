import React from 'react';

interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  value,
  onChange,
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
      bg-white text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500
      sm:text-sm ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}; 