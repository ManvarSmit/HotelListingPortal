import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup({ setCurrUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrUser(data.user);
        navigate("/");
      } else {
        // Show the exact error from the server
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "450px" }}>
      <div className="card border-0 shadow-sm p-4 rounded-4">
        <h3 className="fw-bold text-center mb-4">Sign up on Wanderlust</h3>
        {error && <div className="alert alert-danger p-2 small">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Username</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-danger w-100 py-2 rounded-3 fw-bold">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
