import React from "react";

function TraineeLogin() {
  return (
    <div className="container">
      <div className="card">
        <h3>Trainee Login</h3>
        <form>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" />
          </div>
          <button className="btn btn-success w-100">Login</button>
           <div className="mb-3 text-end">
              <a href="/forgot-password" className="text-light">Forgot Password?</a>
            </div>
        </form>
      </div>
    </div>
  );
}

export default TraineeLogin;