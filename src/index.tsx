import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { register } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker for offline capabilities
register({
  onUpdate: (registration) => {
    // New content is available, show update notification
    serviceWorkerRegistration.showUpdateNotification(registration);
  },
  onSuccess: (registration) => {
    // Content is cached for offline use
    console.log('Content is cached for offline use.');
  }
});
