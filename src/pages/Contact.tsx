import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import ContactInfo from '../components/ui/ContactInfo';

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
    organization: '',
    department: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          organization: '',
          department: '',
        });
        onSubmit();
      }, 1500);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-cinzel text-primary mb-8 text-center">Contact Us</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="lg:w-1/3">
          <Card className="bg-secondary/40 backdrop-blur-sm p-6 sticky top-24">
            <h2 className="text-xl font-cinzel text-primary mb-6">Get in Touch</h2>
            
            <p className="text-white/70 mb-8">
              Have questions about government tenders or need assistance with the bidding process? 
              Our team is here to help you navigate the complexities of tender participation.
            </p>
            
            <ContactInfo variant="default" />
            
            <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/30">
              <h3 className="text-primary font-medium mb-2">Office Hours</h3>
              <p className="text-white/70">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-white/70">Saturday: 10:00 AM - 2:00 PM</p>
              <p className="text-white/70">Sunday: Closed</p>
            </div>
          </Card>
        </div>
        
        {/* Contact Form */}
        <div className="lg:w-2/3">
          <Card className="bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-xl font-cinzel text-primary mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2" htmlFor="name">Full Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-md text-white focus:outline-none focus:border-primary`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-white mb-2" htmlFor="email">Email Address*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-md text-white focus:outline-none focus:border-primary`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-white mb-2" htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2" htmlFor="organization">Organization</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white mb-2" htmlFor="subject">Subject*</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-white/5 border ${errors.subject ? 'border-red-500' : 'border-white/20'} rounded-md text-white focus:outline-none focus:border-primary`}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>
              
              <div>
                <label className="block text-white mb-2" htmlFor="message">Your Message*</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-2 bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/20'} rounded-md text-white focus:outline-none focus:border-primary`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-secondary font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;

