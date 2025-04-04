import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { motion } from 'framer-motion';

const Register = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="w-full max-w-md px-4">
        <RegisterForm />
      </div>
    </motion.div>
  );
};

export default Register; 