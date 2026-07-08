import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// In local dev, Vite proxies /api to localhost:5000 (see vite.config.ts), so no
// base URL is needed. In production (Vercel), the frontend and API are deployed
// separately, so we point requests at the deployed API server explicitly.
if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
  setBaseUrl(import.meta.env.VITE_API_URL);
}

createRoot(document.getElementById('root')!).render(<App />);
