import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";
import "../styles/auth.css";
import "../styles/auth-roles.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/adminCheck/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();
      if(!res.ok){
        setError(data.error || "Login Failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("adminLoggedIn", "true");
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        login("admin");
        navigate("/admins-DB");
      }, 1200);

    } catch (err) {
      setError("Server not responding");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">

        <div className="auth-illustration illus-admin">
          <div className="illus-glass">
            <div className="illus-icon illus-icon-admin"></div>
            <p className="illus-label">Admin Access</p>
          </div>
        </div>

        <div className="auth-content">
          <h1 className="auth-title">Admin Login</h1>
          <p className="auth-subtitle">Manage the entire system</p>

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
            {success && (<div className="login-success"><div className="tick">✓</div><p>Login Successful</p></div>)}

            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Logging IN..." : "Login"}</button>
          </form>

          <div className="auth-footer">Restricted access</div>
        </div>
      </div>
    </div>


    // <div className="auth-page">
    //   {error && <div className="alert alert-danger py-2">{error}</div>}
    //   <div className="card">
    //    <div className="d-flex justify-content-between align-items-center mb-3">
    //       <div>
    //         <h4 className="mb-0">Admin Login</h4>
    //         <small style={{ opacity: 0.7 }}>Student Management System</small>
    //       </div>
    //       <button
    //         type="button"
    //         className="btn btn-sm btn-outline-light"
    //         onClick={() => navigate("/")}
    //       >
    //         ⬅ Back
    //       </button>
    //     </div>
    //     <form onSubmit={handleSubmit}>
    //       <div className="mb-3">
    //         <label className="form-label">Username</label>
    //         <input type="text" className="form-control" placeholder="have u remembered..." value={username} onChange={(e) => setUsername(e.target.value)} required />
    //       </div>
    //       <div className="mb-3">
    //         <label className="form-label">Password</label>
    //         <input type="password" className="form-control" placeholder="password plzzz..." value={password} onChange={(e) => setPassword(e.target.value)} required />
    //       </div>
    //       <button className="btn btn-primary w-100">Login</button>
    //         <div className="mb-3 text-end">
    //           <a href="/forgot-password" className="text-light">Forgot Password?</a>
    //         </div>
           
    //     </form>
    //   </div>
    // </div>
  );
}

export default AdminLogin;