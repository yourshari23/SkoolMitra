import React from "react";

function TraineeSignup() {
  return (
    <div className="container">
      <div className="card">
        <h3>Trainee Signup</h3>
        <form>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" />
          </div>
          <button className="btn btn-warning w-100">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default TraineeSignup;