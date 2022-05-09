import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import ContainerList from './pages/ContainerList';

// Components
import Navbar from './components/navbar';

export default function IssueTracker() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="home" element={<Home />}/>
          <Route path="about" element={<About />}/>
          <Route path="container-list" element={<ContainerList />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const container = document.getElementById('root');
const root = createRoot(container)
root.render(<IssueTracker />);
