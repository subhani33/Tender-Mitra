import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoProps {
  className?: string;
  iconSize?: number;
  vertical?: boolean;
  withLabels?: boolean;
  withBackground?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  className = '',
  iconSize = 18,
  vertical = false,
  withLabels = false,
  withBackground = false
}) => {
  const containerClasses = `flex ${vertical ? 'flex-col space-y-3' : 'space-x-4'} ${className}`;
  
  const itemClasses = `flex items-center ${withBackground ? 'bg-secondary/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/10' : ''}`;
  
  return (
    <div className={containerClasses}>
      <a 
        href="mailto:tendermitra2025@gmail.com" 
        className={`${itemClasses} hover:text-primary transition-colors`}
      >
        <Mail className="text-primary" size={iconSize} />
        {withLabels ? (
          <div className="ml-2">
            <span className="block text-xs text-white/50">Email</span>
            <span className="block">tendermitra2025@gmail.com</span>
          </div>
        ) : (
          <span className="ml-2">tendermitra2025@gmail.com</span>
        )}
      </a>
      
      <a 
        href="tel:+916281167095" 
        className={`${itemClasses} hover:text-primary transition-colors`}
      >
        <Phone className="text-primary" size={iconSize} />
        {withLabels ? (
          <div className="ml-2">
            <span className="block text-xs text-white/50">Phone</span>
            <span className="block">+91 62811 67095</span>
          </div>
        ) : (
          <span className="ml-2">+91 62811 67095</span>
        )}
      </a>
      
      <div className={itemClasses}>
        <MapPin className="text-primary" size={iconSize} />
        {withLabels ? (
          <div className="ml-2">
            <span className="block text-xs text-white/50">Location</span>
            <span className="block">Tamil Nadu, India</span>
          </div>
        ) : (
          <span className="ml-2">Tamil Nadu, India</span>
        )}
      </div>
    </div>
  );
};

export default ContactInfo; 