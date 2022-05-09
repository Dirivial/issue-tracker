import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import About from './pages/About';
import ContainerList from './pages/ContainerList';

export default function IssueTracker() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="about" element={<About />}/>
        <Route path="container-list" element={<ContainerList />}/>
      </Routes>
    </BrowserRouter>
  )
}

const container = document.getElementById('root');
const root = createRoot(container)
root.render(<IssueTracker />);
