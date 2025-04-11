import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
  iconSize?: number;
  showTitle?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ 
  variant = 'default', 
  className = '', 
  iconSize = 20,
  showTitle = true
}) => {
  // Contact information constants
  const EMAIL = 'tendermitra2025@gmail.com';
  const PHONE = '6281167095';
  const ADDRESS = 'Tamil Nadu, India';
  
  const getItemClass = () => {
    switch(variant) {
      case 'compact':
        return 'flex items-center gap-2 text-sm';
      case 'icon-only':
        return 'flex items-center justify-center';
      default:
        return 'flex items-start';
    }
  };
  
  return (
    <div className={`contact-info ${className}`}>
      {showTitle && variant !== 'icon-only' && (
        <h3 className="text-lg font-cinzel text-primary mb-4">Contact Us</h3>
      )}
      
      <ul className="space-y-4">
        <li className={getItemClass()}>
          <Mail className="text-primary flex-shrink-0" size={iconSize} />
          {variant !== 'icon-only' && (
            <div>
              {variant === 'default' && <p className="text-white/50 text-sm">Email</p>}
              <a href={`mailto:${EMAIL}`} className="text-white hover:text-primary transition-colors">
                {EMAIL}
              </a>
            </div>
          )}
        </li>
        
        <li className={getItemClass()}>
          <Phone className="text-primary flex-shrink-0" size={iconSize} />
          {variant !== 'icon-only' && (
            <div>
              {variant === 'default' && <p className="text-white/50 text-sm">Phone</p>}
              <a href={`tel:+91${PHONE}`} className="text-white hover:text-primary transition-colors">
                {PHONE}
              </a>
            </div>
          )}
        </li>
        
        <li className={getItemClass()}>
          <MapPin className="text-primary flex-shrink-0" size={iconSize} />
          {variant !== 'icon-only' && (
            <div>
              {variant === 'default' && <p className="text-white/50 text-sm">Address</p>}
              <p className="text-white">{ADDRESS}</p>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo; 