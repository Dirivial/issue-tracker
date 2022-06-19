import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AccountContext } from './context';
import { useCookies } from 'react-cookie';
import { decodeToken } from 'react-jwt';
import React, { useState, useRef } from 'react';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';


// Pages
import Home from './pages/Home';
import About from './pages/About';
import ContainerList from './pages/ContainerList';
import Container from './pages/Container';
import Login from './pages/Login';

// Components
import Navbar from './components/navbar';

export default function IssueTracker() {

    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [token, setToken] = useState(cookies.token);

    const stateRef = useRef();
    stateRef.current = token;

    const userId = (cookies.token !== undefined) ? decodeToken(cookies.token) : 0;
    console.log(cookies);
    
    return (
        <AccountContext.Provider value={{token: token, userId: userId, setToken: setToken}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                    <Route path="" element={<Login />} />
                    <Route path="home" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="container-list" element={<ContainerList />} />
                    <Route path="example-container" element={<Container />} />

                    </Route>
                </Routes>
            </BrowserRouter>
        </AccountContext.Provider>
    )
}

const container = document.getElementById('root');
const root = createRoot(container)
root.render(<IssueTracker />);
