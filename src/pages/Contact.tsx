import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactProps {
  onSubmit: () => void;
}

const Contact: React.FC<ContactProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        setIsSubmitting(false);
        onSubmit();
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }, 1000);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Contact Us</h1>
        <p className="text-white/70 mt-2">
          Have questions about our services? Reach out to our team and we'll get back to you as soon as possible.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            
            <ul className="space-y-6">
              <li className="flex items-start">
                <Mail className="text-primary mt-1 mr-4" size={20} />
                <div>
                  <p className="text-white/50 text-sm">Email</p>
                  <a href="mailto:info@tendermitra.gov.in" className="text-white hover:text-primary transition-colors">
                    info@tendermitra.gov.in
                  </a>
                </div>
              </li>
              
              <li className="flex items-start">
                <Phone className="text-primary mt-1 mr-4" size={20} />
                <div>
                  <p className="text-white/50 text-sm">Phone</p>
                  <a href="tel:+911123456789" className="text-white hover:text-primary transition-colors">
                    +91 11 2345 6789
                  </a>
                </div>
              </li>
              
              <li className="flex items-start">
                <MapPin className="text-primary mt-1 mr-4" size={20} />
                <div>
                  <p className="text-white/50 text-sm">Address</p>
                  <p className="text-white">
                    Department of Tender Management<br />
                    Ministry of Commerce<br />
                    North Block, New Delhi - 110001<br />
                    India
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Office Hours</h2>
            
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-white/70">Monday - Friday</span>
                <span className="text-white">9:00 AM - 5:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/70">Saturday</span>
                <span className="text-white">9:00 AM - 1:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/70">Sunday</span>
                <span className="text-white">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white/70 mb-1 text-sm">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-secondary border ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    } rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white/70 mb-1 text-sm">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-secondary border ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    } rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent`}
                    placeholder="Your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-white/70 mb-1 text-sm">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-secondary border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-white/70 mb-1 text-sm">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full bg-secondary border ${
                      errors.subject ? 'border-red-500' : 'border-gray-700'
                    } rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-transparent`}
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Tender Submission">Tender Submission</option>
                    <option value="Bid Clarification">Bid Clarification</option>
                    <option value="Account Issues">Account Issues</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white/70 mb-1 text-sm">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full bg-secondary border ${
                    errors.message ? 'border-red-500' : 'border-gray-700'
                  } rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent`}
                  placeholder="Your message"
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-gray-900 font-medium py-2 px-6 rounded-md flex items-center space-x-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="bg-secondary-dark rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Our Location</h2>
        <div className="rounded-lg overflow-hidden h-64 bg-secondary">
          {/* Placeholder for map - In a real app, this would be a Google Maps integration */}
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <p className="text-white/70">Map integration would be placed here</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
