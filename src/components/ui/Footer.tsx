import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, LinkedIn, Youtube, Instagram } from 'lucide-react';
import ContactInfo from './ContactInfo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/80 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-cinzel text-primary mb-6">Contact Information</h3>
            <ContactInfo variant="default" className="mt-4" />
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-cinzel text-primary mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/tenders" className="text-white hover:text-primary transition-colors">
                  Browse Tenders
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="text-white hover:text-primary transition-colors">
                  Knowledge Hub
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white hover:text-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-white hover:text-primary transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link to="/todo" className="text-white hover:text-primary transition-colors">
                  Task Manager
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-cinzel text-primary mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-white hover:text-primary transition-colors">
                  Official Guidelines
                </Link>
              </li>
              <li>
                <a href="/docs/tender-faq.pdf" className="text-white hover:text-primary transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/docs/terms-of-service.pdf" className="text-white hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/docs/privacy-policy.pdf" className="text-white hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h3 className="text-lg font-cinzel text-primary mb-6">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                <Twitter size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                <LinkedIn size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                <Youtube size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-white/5 border border-white/20 focus:border-primary/50 rounded-l-md w-full text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-secondary rounded-r-md hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-white/60">
          <p>© {new Date().getFullYear()} Tender Mitra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 