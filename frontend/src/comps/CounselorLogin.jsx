import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";
import "../styles/auth.css";
import "../styles/auth-roles.css";

function CounselorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/counselor-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if(!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        localStorage.setItem("counselorId", data.counselor_id);
        localStorage.setItem("counselorName", data.name);
        login("counselor");
        navigate("/counselor-DB");
      }, 1200)
  
    } catch {
      setError("Server not responding");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-illustration illus-counselor">
          <div className="illus-glass">
            <div className="illus-icon illus-icon-counselor"></div>
            <p className="illus-label">Counselor Portal</p>
          </div>
        </div>
        <div className="auth-content">
          <h1 className="auth-title">Counselor Login</h1>
          <p className="auth-subtitle">Student performance & reports</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              className="auth-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="auth-error">{error}</div>}
            {success && (
              <div className="login-success">
                <div className="tick">✓</div>
                <p>Login Successful</p>
              </div>
            )}
            <button className="auth-btn" type="submit" disabled={loading || success} >{loading ? "Logging IN..." : "Login"}</button>
          </form>

          <div className="auth-footer">Authorized person's only</div>
        </div>
      </div>
    </div>
  );
}

export default CounselorLogin;