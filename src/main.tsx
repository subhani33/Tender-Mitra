import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Declare the preloadComplete property on the Window interface
declare global {
  interface Window {
    preloadComplete?: boolean;
  }
}

// Wait for preload script to complete or timeout after 500ms
const startReactApp = () => {
  // Remove any loading indicators that might be in the DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    // Render the React app
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
};

// Check if preload is complete or wait for 500ms
if (window.preloadComplete) {
  // Preload has already completed, render immediately
  startReactApp();
} else {
  // Set a maximum timeout to ensure the app renders
  const timeout = setTimeout(() => {
    console.log('Preload took too long, rendering app anyway');
    startReactApp();
  }, 500);

  // Also listen for preload completion
  window.addEventListener('load', () => {
    if (window.preloadComplete) {
      clearTimeout(timeout);
      startReactApp();
    }
  });
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