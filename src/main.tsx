/**
 * TLALMANAC-X · Application entry point.
 * Mounts <App /> into #root and pulls in global resets + fonts.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
