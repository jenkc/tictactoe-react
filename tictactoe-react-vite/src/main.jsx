import React, { StrictMode } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './App.css';

import App from './App.jsx';

const root = createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
