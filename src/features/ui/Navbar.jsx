// src/features/ui/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  const handleLogout = async () => {
    try {
      const resp = await fetch("/api/logout", {
        method: "DELETE",           
        credentials: "include",    
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Logout response status:", resp.status);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <nav
      style={{
        width: "100%",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#1f2937",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <h2 style={{ margin: 0 }}>DevHub Frontend</h2>

        <Link style={styles.link} to="/projects">
          All Projects
        </Link>

        <Link style={styles.link} to="/my-tasks">
          My Tasks
        </Link>
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

const styles = {
  link: {
    color: "#93c5fd",
    textDecoration: "none",
    fontSize: "1rem",
  },
  logoutButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
