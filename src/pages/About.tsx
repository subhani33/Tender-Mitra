import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">About Tender Mitra</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300">
            Tender Mitra is India's premier platform for government tender management, designed to streamline 
            the entire tendering process for both government agencies and vendors. Launched in 2023 as part 
            of the Digital India initiative, our platform brings transparency, efficiency, and accessibility 
            to public procurement.
          </p>
          
          <p className="text-gray-600 dark:text-gray-300">
            Our mission is to transform the tender management landscape in India by leveraging technology 
            to create a seamless experience for all stakeholders involved in the procurement process.
          </p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Our Vision</h2>
        
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md">
          <p className="text-gray-700 dark:text-gray-300 italic text-lg">
            "To become the most trusted digital platform for government procurement in India, fostering 
            transparency, efficiency, and fair competition in public tendering."
          </p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Transparency</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in complete transparency in the tendering process, ensuring all stakeholders 
              have access to the information they need.
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Integrity</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We maintain the highest standards of integrity in all our operations, fostering trust 
              among government agencies and vendors.
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We continuously innovate to improve our platform, incorporating the latest technologies 
              to enhance user experience and efficiency.
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Accessibility</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We are committed to making government tenders accessible to all eligible vendors, 
              regardless of their size or location.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
              <img 
                src="/img/team/profile1.jpg" 
                alt="Rajesh Sharma" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Rajesh Sharma</h3>
            <p className="text-gray-600 dark:text-gray-400">CEO & Founder</p>
          </div>
          
          <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
              <img 
                src="/img/team/profile2.jpg" 
                alt="Priya Patel" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Priya Patel</h3>
            <p className="text-gray-600 dark:text-gray-400">CTO</p>
          </div>
          
          <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
              <img 
                src="/img/team/profile3.jpg" 
                alt="Anand Gupta" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Anand Gupta</h3>
            <p className="text-gray-600 dark:text-gray-400">Head of Operations</p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Partners & Affiliations</h2>
        
        <div className="bg-white dark:bg-[#0F172A] p-6 rounded-lg shadow-md">
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Ministry of Finance</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Digital India</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">GeM Portal</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Make in India</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Startup India</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">MSME Development</span>
            </li>
          </ul>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
