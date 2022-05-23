import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';


// Pages
import Home from './pages/Home';
import About from './pages/About';
import ContainerList from './pages/ContainerList';
import Container from './pages/Container';

// Components
import Navbar from './components/navbar';

export default function IssueTracker() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navbar />}>
            <Route path="" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="container-list" element={<ContainerList />} />
            <Route path="example-container" element={<Container />} />

            </Route>
        </Routes>
    </BrowserRouter>
    )
}

const container = document.getElementById('root');
const root = createRoot(container)
root.render(<IssueTracker />);
