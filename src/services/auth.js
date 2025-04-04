import api from './api';

/**
 * Authentication service for Tender Mitra
 * Handles user registration, login, and token management
 */
const AuthService = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data (firstName, lastName, email, password)
     * @returns {Promise} - Promise with registration result
     */
    registerUser: async(userData) => {
        try {
            // Prepare the payload in correct format for backend
            const payload = {
                ...userData,
                // Ensure name is included for backward compatibility
                name: userData.name || `${userData.firstName} ${userData.lastName}`
            };

            const response = await api.post('/api/auth/register', payload);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    name: payload.name,
                    email: payload.email
                }));
                return { success: true, data: response.data };
            }
            return { success: false, error: 'No token received' };
        } catch (error) {
            console.error('Registration error:', error);

            // Handle specific errors with better messages
            if (error.response) {
                const status = error.response.status;
                const errorMsg = error.response && error.response.data && error.response.data.message || '';

                if (status === 409 || errorMsg.includes('already exists')) {
                    return {
                        success: false,
                        error: 'An account with this email already exists'
                    };
                }

                return {
                    success: false,
                    error: errorMsg || 'Registration failed'
                };
            }

            return {
                success: false,
                error: error.message || 'Registration failed. Please check your connection and try again.'
            };
        }
    },

    /**
     * Login an existing user
     * @param {Object} credentials - User login credentials (email, password)
     * @returns {Promise} - Promise with login result
     */
    loginUser: async(credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.data && response.data.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                }
                return { success: true, data: response.data };
            }
            return { success: false, error: 'No token received' };
        } catch (error) {
            console.error('Login error:', error);

            // Handle specific errors
            if (error.response) {
                const status = error.response.status;

                if (status === 401) {
                    return {
                        success: false,
                        error: 'Invalid email or password'
                    };
                }

                return {
                    success: false,
                    error: error.response && error.response.data && error.response.data.message || 'Login failed'
                };
            }

            return {
                success: false,
                error: error.message || 'Login failed. Please check your connection and try again.'
            };
        }
    },

    /**
     * Logout the current user
     * Removes token from localStorage
     */
    logoutUser: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Also call the backend logout endpoint to invalidate the token
        api.get('/api/auth/logout').catch(() => {});
        return { success: true };
    },

    /**
     * Get current authentication state
     * @returns {Boolean} - True if user is authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Get JWT token
     * @returns {String|null} - The JWT token or null
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Get current user profile
     * @returns {Promise} - Promise with user profile data
     */
    getCurrentUser: async() => {
        try {
            if (!AuthService.isAuthenticated()) {
                return { success: false, error: 'Not authenticated' };
            }

            // Try to get user from local storage first
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
                try {
                    const parsedUser = JSON.parse(cachedUser);
                    // If we have a complete user profile, return it
                    if (parsedUser && parsedUser.email) {
                        return { success: true, data: parsedUser };
                    }
                } catch (e) {
                    // Invalid JSON, ignore and continue to fetch
                    localStorage.removeItem('user');
                }
            }

            // Fetch fresh user data from the server
            const response = await api.get('/api/auth/me');
            if (response.data.data.user) {
                // Update the cached user
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            return { success: true, data: response.data.data.user };
        } catch (error) {
            console.error('Get user profile error:', error);
            return {
                success: false,
                error: error.response && error.response.data && error.response.data.message || 'Failed to get user profile'
            };
        }
    }
};

export default AuthService;