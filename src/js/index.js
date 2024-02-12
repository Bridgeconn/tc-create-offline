import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// import ReactDOM from 'react-dom/client';


const root =  createRoot(document.getElementById('tsv-editor'));
root.render(<App />);
