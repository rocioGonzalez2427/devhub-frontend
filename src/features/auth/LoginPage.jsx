// src/features/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/ToastProvider";

export function LoginPage() {
  const [email, setEmail] = useState("auth-admin@test.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const json = await resp.json();

      if (!resp.ok || !json.success) {
        setError(json.error || "Login failed");
      } else {
        showToast?.("Logged in successfully");
        navigate("/projects");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2 className="auth-title">Sign in to DevHub</h2>
        <p className="auth-subtitle">
          Use one of the seeded users (admin / owner / viewer).
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className={`button button-primary ${
              loading ? "button-loading" : ""
            }`}
            disabled={loading}
            style={{ width: "100%", marginTop: "10px" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-hint">
            Example: <strong>auth-admin@test.com / password</strong>
          </p>
        </form>
      </div>
    </div>
  );
}
