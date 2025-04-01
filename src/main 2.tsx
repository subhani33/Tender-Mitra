import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Add debugging logs
console.log('Main.tsx starting to initialize...')

// Create root with error handling
const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Failed to find the root element')
} else {
  console.log('Root element found, creating React root...')
  const root = ReactDOM.createRoot(rootElement)
  
  // Add error boundary for better error reporting
  console.log('Rendering app with error boundary...')
  root.render(
    <StrictMode>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-lg text-white">
              <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
              <p className="mb-6">
                We encountered an unexpected error loading the application.
              </p>
              <div id="error-details" className="mb-6 p-4 bg-red-500/20 rounded text-sm overflow-auto max-h-[200px]">
                <p>Check the browser console for more details.</p>
              </div>
              <button
                className="px-4 py-2 bg-white text-blue-900 rounded hover:bg-blue-50 transition-colors font-medium"
                onClick={() => window.location.reload()}
              >
                Reload the Application
              </button>
            </div>
          </div>
        }
      >
        <App />
      </ErrorBoundary>
    </StrictMode>
  )
  console.log('App rendered successfully!')
}

// Register service worker with better error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('Registering service worker...');
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(error => {
        console.log('SW registration failed: ', error);
      });
  });
} 