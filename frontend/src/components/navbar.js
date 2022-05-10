import { Outlet } from 'react-router-dom';

import './navbar.css';

export default function Navbar() {

  return (
    <div>
      <div className="navbar">
        <p>This is my navbar</p>
      </div>

      <Outlet />
    </div>
  )
}
