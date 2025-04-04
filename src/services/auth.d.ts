/**
 * Auth service type definitions
 */

interface AuthResult {
  success: boolean;
  data?: any;
  error?: string | undefined;
}

interface UserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
}

interface AuthService {
  /**
   * Register a new user
   * @param userData - User registration data (firstName, lastName, email, password)
   * @returns Promise with registration result
   */
  registerUser: (userData: UserData) => Promise<AuthResult>;
  
  /**
   * Login an existing user
   * @param credentials - User login credentials (email, password)
   * @returns Promise with login result
   */
  loginUser: (credentials: Credentials) => Promise<AuthResult>;
  
  /**
   * Logout the current user
   * Removes token from localStorage
   */
  logoutUser: () => AuthResult;
  
  /**
   * Get current authentication state
   * @returns Boolean - True if user is authenticated
   */
  isAuthenticated: () => boolean;
  
  /**
   * Get JWT token
   * @returns The JWT token or null
   */
  getToken: () => string | null;
  
  /**
   * Get current user profile
   * @returns Promise with user profile data
   */
  getCurrentUser: () => Promise<AuthResult>;
}

declare const auth: AuthService;
export default auth; 