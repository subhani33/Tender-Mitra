import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 