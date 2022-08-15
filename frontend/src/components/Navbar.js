import { Outlet, useNavigate, Link } from 'react-router-dom';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import useLogout from '../hooks/useLogout.js';

import './Navbar.css';

export default function MyNavbar() {

    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
    <div className="background">
        <Navbar className="navbar navbar-expand-lg navbar-dark bg-dark ml-auto">
            <Nav className="me-auto navstuff">
                <Link className="navbarlink" to="/">Home</Link>
                <Link className="navbarlink"to="/containers">Containers</Link>
                <Link className="navbarlink"to="/about">About</Link>
            </Nav>

            <Navbar.Collapse className="justify-content-end">
                <button className="logoutButton" onClick={signOut}>Sign Out</button>
            </Navbar.Collapse>
        </Navbar>
        <Outlet />
    </div>
    )
}
