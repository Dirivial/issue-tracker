import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';

export default function IssueTracker() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

const container = document.getElementById('root');
const root = createRoot(container)
root.render(<App />);
