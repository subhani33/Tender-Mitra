import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // In a real app, this would update the global auth state
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="w-full max-w-md px-4">
        <LoginForm onLogin={handleLogin} />
      </div>
    </motion.div>
  );
};

export default Login; 