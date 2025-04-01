import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

// Also keep default export for backward compatibility
export default Input; 