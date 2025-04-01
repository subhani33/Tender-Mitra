import React from 'react';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: 'Tender Notification',
      description: 'Get real-time alerts for new government tenders matching your profile and preferences.',
      icon: (
        <svg className="w-12 h-12 text-blue-600 dark:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: 'Document Preparation',
      description: 'Access templates and tools to prepare professional tender documents and bids.',
      icon: (
        <svg className="w-12 h-12 text-blue-600 dark:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Bid Management',
      description: 'Organize and track all your bid submissions, deadlines, and updates in one place.',
      icon: (
        <svg className="w-12 h-12 text-blue-600 dark:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: 'Analytics',
      description: 'Gain insights into tender patterns, success rates, and competitor analysis.',
      icon: (
        <svg className="w-12 h-12 text-blue-600 dark:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      title: 'Compliance Verification',
      description: 'Ensure your bids meet all the requirements with our automated compliance checker.',
      icon: (
        <svg className="w-12 h-12 text-blue-600 dark:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Tender Learning Hub',
      description: 'Access training materials, guides, and webinars to improve your tender success rate.',
      icon: (
        <svg className="w-12 h-12 text-blue-600 dark:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  const plans = [
    {
      name: 'Basic',
      price: '₹0',
      period: 'Free Forever',
      description: 'For vendors new to government tenders',
      features: [
        'Basic tender alerts',
        'Limited document templates',
        'Basic bid tracking',
        'Community forum access',
        'Email support'
      ],
      cta: 'Sign Up Now',
      highlighted: false
    },
    {
      name: 'Professional',
      price: '₹2,999',
      period: 'per month',
      description: 'For active tender participants',
      features: [
        'Advanced tender matching',
        'Full template library access',
        'Complete bid management',
        'Basic analytics',
        'Compliance verification',
        'Priority email & chat support'
      ],
      cta: 'Start 14-Day Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Tailored Solution',
      description: 'For large organizations and government agencies',
      features: [
        'Custom tender alerts',
        'White-labeled portal',
        'Advanced analytics & reporting',
        'API integration',
        'Dedicated account manager',
        '24/7 premium support'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="py-8 mb-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Our Services</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Comprehensive solutions to streamline your government tender processes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section className="py-8 mb-12 bg-gray-50 dark:bg-[#1A2A44] rounded-lg">
        <div className="max-w-4xl mx-auto text-center mb-12 px-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our streamlined process makes tender management simple and efficient
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 dark:bg-[#D4AF37]/30 -translate-y-1/2 z-0"></div>
            
            {['Profile Setup', 'Tender Matching', 'Document Preparation', 'Bid Submission', 'Tracking & Analytics'].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center mb-8 md:mb-0 z-10 w-full md:w-auto">
                <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-[#D4AF37] text-white flex items-center justify-center font-semibold mb-3">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-8 mb-12">
        <div className="max-w-4xl mx-auto text-center mb-12 px-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Pricing Plans</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Choose the plan that fits your tender management needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md overflow-hidden ${
                plan.highlighted 
                  ? 'border-2 border-blue-500 dark:border-[#D4AF37] relative' 
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-blue-500 dark:bg-[#D4AF37] text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="bg-white dark:bg-[#0F172A] p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-800 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400"> {plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-2 rounded-md font-medium ${
                    plan.highlighted
                      ? 'bg-blue-600 dark:bg-[#D4AF37] text-white hover:bg-blue-700 dark:hover:bg-[#C49620]'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="py-8 mb-12">
        <div className="bg-blue-50 dark:bg-[#0F172A] rounded-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find answers to common questions about our services
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">How do I get started with Tender Mitra?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simply sign up for a free account, complete your profile with your business details and tender interests, 
                and you'll start receiving tender notifications that match your profile.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Can I use Tender Mitra on mobile devices?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, Tender Mitra is fully responsive and works on all devices including smartphones and tablets. 
                We also offer dedicated mobile apps for both Android and iOS.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">How secure is my data on Tender Mitra?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We employ industry-leading security measures including end-to-end encryption, secure data centers, 
                and regular security audits to ensure your data remains safe and confidential.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Does Tender Mitra offer training for new users?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer comprehensive onboarding support including video tutorials, webinars, and 
                user guides to help you get the most out of our platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Services;
