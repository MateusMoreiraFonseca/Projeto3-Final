import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { BrowserRouter as Router } from 'react-router-dom'; 
import './index.css';
import App from './App'; 
import reportWebVitals from './reportWebVitals';
import { DataProvider } from './DataContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <DataProvider>
      <Router>
        <App />
      </Router>
    </DataProvider>
  </React.StrictMode>
);

reportWebVitals();
