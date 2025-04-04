import axios from 'axios';

// Get the API base URL from environment variables
const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Configure axios instance with default settings
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Add request interceptor to include authentication token
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Add response interceptor to handle common errors
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors (expired token)
        if (error.response && error.response.status === 401) {
            // Clear the token
            localStorage.removeItem('token');

            // Redirect to login page if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login?session=expired';
            }
        }

        return Promise.reject(error);
    }
);

export default api;