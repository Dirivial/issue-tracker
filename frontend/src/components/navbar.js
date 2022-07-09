import { Outlet, useNavigate, Link } from 'react-router-dom';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import useLogout from '../hooks/useLogout.js';

import './navbar.css';

export default function MyNavbar() {

    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
    <div>
        <Navbar className="navbar navbar-expand-lg navbar-dark bg-dark ml-auto">
            <Nav className="me-auto">
                <Link to="/">Home</Link>

                <Link to="/container-list">Containers</Link>
                <Link to="/about">About</Link>
                <Link to="/example-container">example-container</Link>
            </Nav>

            <Navbar.Collapse className="justify-content-end">
                <Button variant="dark" className="logoutButton" onClick={signOut}>Sign Out</Button>
            </Navbar.Collapse>
        </Navbar>
        <Outlet />
    </div>
    )
}
