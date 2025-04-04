import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthService from '../../services/auth';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*#?&]/.test(password);
    return { hasMinLength, hasLetter, hasNumber, hasSpecial };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Basic validation
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.hasMinLength || !passwordValidation.hasLetter || 
          !passwordValidation.hasNumber || !passwordValidation.hasSpecial) {
        setError('Password does not meet all requirements');
        setIsLoading(false);
        return;
      }

      // Call the auth service
      const result = await AuthService.registerUser({
        name: username,
        email,
        password
      });

      if (result.success) {
        setSuccess('Registration successful! You will be redirected to login.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(password);

  return (
    <div className="flex items-center justify-center bg-[#0D1629] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A2A44] p-8 rounded-xl border border-gray-700 shadow-xl max-w-md w-full"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold font-cinzel text-primary mb-2">Create Account</h2>
          <p className="text-gray-300">Join Tender Mitra platform today</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-2"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-900/30 text-green-400 p-4 rounded-lg mb-6 flex items-center gap-2"
            >
              <CheckCircle2 size={20} />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full p-3 bg-[#0D1629] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Choose a username"
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 bg-[#0D1629] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full p-3 bg-[#0D1629] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className={`text-sm ${passwordValidation.hasMinLength ? 'text-green-400' : 'text-gray-400'}`}>
                  • At least 8 characters
                </p>
                <p className={`text-sm ${passwordValidation.hasLetter ? 'text-green-400' : 'text-gray-400'}`}>
                  • Contains letters
                </p>
                <p className={`text-sm ${passwordValidation.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                  • Contains numbers
                </p>
                <p className={`text-sm ${passwordValidation.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>
                  • Contains special characters
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-black py-3 rounded-lg font-semibold 
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'} 
              transition-all duration-200 relative overflow-hidden`}
          >
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </motion.div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}