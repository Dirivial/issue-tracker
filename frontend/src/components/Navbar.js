import { Outlet, useNavigate, Link } from "react-router-dom";

import useLogout from "../hooks/useLogout.js";

import "./Navbar.css";

export default function MyNavbar() {
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="background">
      <div className="navbar">
        <div className="navstuff">
          <Link className="navbarlink" to="/">
            Containers
          </Link>
          <Link className="navbarlink" to="/about">
            About
          </Link>
        </div>

        <div className="">
          <button className="logoutButton" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>
      <div className="navbarOutlet">
        <Outlet />
      </div>
    </div>
  );
}
