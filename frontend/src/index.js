import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import React from 'react';
import App from './App.js';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function IssueTracker() {

    return (
        <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/*' element={<App />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
        </React.StrictMode>
    )
}

const container = document.getElementById('root');
const root = createRoot(container)
root.render(<IssueTracker />);


