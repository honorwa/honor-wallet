
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const getClientId = (): string => {
  // 1. Prioritize Vite Standard: import.meta.env
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      // @ts-ignore
      return import.meta.env.VITE_GOOGLE_CLIENT_ID;
    }
  } catch (e) {
    // Ignore error if import.meta is not available
  }

  // 2. Fallback: process.env (defined in vite.config.ts)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.VITE_GOOGLE_CLIENT_ID) {
      // @ts-ignore
      return process.env.VITE_GOOGLE_CLIENT_ID;
    }
  } catch (e) {
    // Ignore error
  }

  // 3. Fallback Placeholder to prevent crash, but Auth will fail if used.
  return "YOUR_GOOGLE_CLIENT_ID_HERE";
};

const clientId = getClientId();

if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
  console.warn("⚠️ Google Client ID is missing or using placeholder.");
  console.warn("Please check your .env file and ensure VITE_GOOGLE_CLIENT_ID is set to a valid Google Cloud Console Client ID.");
} else {
  // Mask the ID for security in logs
  console.log(`✅ Google Client ID loaded: ${clientId.substring(0, 10)}...`);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
