// src/App.js
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MyTasksPage from "./features/tasks/MyTasksPage";
import { AllProjectsPage } from "./features/projects/AllProjectsPage";
import { ProjectDetailPage } from "./features/projects/ProjectDetailPage";
import { LoginPage } from "./features/auth/LoginPage";
import { ToastProvider } from "./features/ui/ToastProvider";
import { Navbar } from "./features/ui/Navbar";
import "./App.css";

function AppContent() {
  const location = useLocation();

  // ⛔ Ocultar navbar en /login
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<AllProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
