/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                'cinzel': ['Cinzel', 'serif'],
                'montserrat': ['Montserrat', 'sans-serif'],
            },
            colors: {
                primary: '#D4AF37',
                secondary: '#1A2A44',
                gold: {
                    100: '#fef5e7',
                    200: '#fae8c8',
                    300: '#f6d394',
                    400: '#f2b95f',
                    500: '#eea02b',
                    600: '#df8917',
                    700: '#b96a14',
                    800: '#935417',
                    900: '#774618',
                    950: '#432509',
                },
                marble: {
                    50: '#f7f7f8',
                    100: '#eeeef1',
                    200: '#d8d9e1',
                    300: '#c0c1cf',
                    400: '#9a9db9',
                    500: '#8083a6',
                    600: '#6c6e8d',
                    700: '#585a73',
                    800: '#4c4d61',
                    900: '#424353',
                    950: '#27272e',
                },
            },
            boxShadow: {
                'gold': '0 4px 14px 0 rgba(238, 160, 43, 0.39)',
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #f6d394 0%, #eea02b 100%)',
                'marble-dark': 'url("/textures/black-marble.jpg")',
                'marble-light': 'url("/textures/white-marble.jpg")',
                'gold-veins': 'url("/textures/gold-veins.png")',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-gold': {
                    '0%, 100%': { opacity: 0.8 },
                    '50%': { opacity: 0.5 },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
};