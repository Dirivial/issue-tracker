import { Outlet, useNavigate } from 'react-router-dom';

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
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/container-list">Containers</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/example-container">example-container</Nav.Link>
            </Nav>

            <Navbar.Collapse className="justify-content-end">
                <Button variant="dark" className="logoutButton" onClick={signOut}>Sign Out</Button>
            </Navbar.Collapse>
        </Navbar>
        <Outlet />
    </div>
    )
}
