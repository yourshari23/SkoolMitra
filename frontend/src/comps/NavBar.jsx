import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, logout } from "../utils/auth";  
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const auth = getAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);


  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();        // clears auth from localStorage
    navigate("/");   // redirect to home / login
  };


  return (
    <header className="navbar glass">
      <div className="nav-left">
        <span className="logo" onClick={() => navigate("/")}>
          Skool<span className="spl">M</span>itra
        </span>
      </div>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>
        ✕
        </button>
        <Link to="#about">About</Link>
        <Link to="#features">Features</Link>
        <Link to="#careers">Careers</Link>
        <Link to="#footer">Contact</Link>

        {/* {!auth.isAuth ? (
          <Link to="/login" className="btn-login">Login</Link>
        ) : (
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        )} */}
      </nav>

      <div className="burger" onClick={() => setOpen(!open)}>
        <span />
        <span />
        <span />
      </div>
    </header>
  );
}
