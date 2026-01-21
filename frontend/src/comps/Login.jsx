import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/auth-roles.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-layout">

        <div className="auth-illustration illus-main">
          <div className="illus-glass">
            <div className="illus-icon illus-icon-main"></div>
            <p className="illus-label">Choose Role</p>
          </div>
        </div>

        <div className="auth-content">
          <h1 className="auth-title">Welcome</h1>
          <p className="auth-subtitle">Choose your role to continue</p>

          <div className="auth-actions">
            <button className="auth-btn" onClick={() => navigate("/admin-login")}>
              Admin Login
            </button>
            <button
              className="auth-btn secondary"
              onClick={() => navigate("/counselorLogin")}
            >
              Counselor Login
            </button>
          </div>
        </div>

      </div>
    </div>

  );
}
