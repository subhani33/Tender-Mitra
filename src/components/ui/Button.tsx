import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };

    const variantClasses = {
      primary: 'bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#1A2A44] font-medium',
      secondary: 'bg-[#1A2A44] hover:bg-[#1A2A44]/80 text-[#D4AF37] border border-[#D4AF37]/50',
      outline: 'bg-transparent hover:bg-white/5 text-[#D4AF37] border border-[#D4AF37]/50',
      ghost: 'bg-transparent hover:bg-white/5 text-white'
    };

    return (
      <button
        ref={ref}
        className={`rounded-md transition-colors flex items-center justify-center ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Also keep default export for backward compatibility
export default Button;