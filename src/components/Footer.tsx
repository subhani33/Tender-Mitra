import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Award, Users } from 'lucide-react';
import ContactInfo from './common/ContactInfo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary border-t border-primary/20 py-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-primary font-cinzel text-xl mb-4">Tender Mitra</h3>
            <p className="text-gray-400 mb-4">
              A comprehensive government tender management platform that simplifies the tender process, 
              bid management, and provides analytics and learning resources.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="text-primary font-cinzel text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tenders" className="text-gray-400 hover:text-primary transition-colors">
                  Tenders
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-gray-400 hover:text-primary transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="text-gray-400 hover:text-primary transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information Section */}
          <div>
            <h3 className="text-primary font-cinzel text-xl mb-4">Contact Us</h3>
            <ContactInfo 
              vertical={true} 
              className="text-gray-400" 
            />
          </div>
        </div>
        
        {/* Our Team Section */}
        <div className="border-t border-primary/10 mt-8 pt-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Users className="text-primary" size={24} />
            <h3 className="text-primary font-cinzel text-xl">Our Team</h3>
            <Award className="text-primary" size={20} />
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-300 italic">A dedicated team with exceptional attention to detail</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            <div className="bg-secondary/60 backdrop-blur-sm p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
              <p className="font-medium text-primary">Patan Khaleed</p>
              <p className="text-gray-400 text-sm">Lead Developer</p>
            </div>
            
            <div className="bg-secondary/60 backdrop-blur-sm p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
              <p className="font-medium text-primary">R. Vamsidhar Reddy</p>
              <p className="text-gray-400 text-sm">UI/UX Specialist</p>
            </div>
            
            <div className="bg-secondary/60 backdrop-blur-sm p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
              <p className="font-medium text-primary">Santhosh Kumar K</p>
              <p className="text-gray-400 text-sm">Backend Engineer</p>
            </div>
            
            <div className="bg-secondary/60 backdrop-blur-sm p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
              <p className="font-medium text-primary">Vijeyandar</p>
              <p className="text-gray-400 text-sm">System Architect</p>
            </div>
            
            <div className="bg-secondary/60 backdrop-blur-sm p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
              <p className="font-medium text-primary">Shajith Rahman N</p>
              <p className="text-gray-400 text-sm">Quality Assurance</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary/10 mt-8 pt-6 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Tender Mitra. All rights reserved. 
            <br className="md:hidden" /> EdtoDo Technovations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 