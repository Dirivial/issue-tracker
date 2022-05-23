import { Outlet } from 'react-router-dom';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import './navbar.css';

export default function MyNavbar() {

  return (
    <div>
        <Navbar className="navbar navbar-expand-lg navbar-dark bg-dark ml-auto">
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/container-list">Containers</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/example-container">example-container</Nav.Link>
            </Nav>
        </Navbar>
        <Outlet />
    </div>
  )
}
