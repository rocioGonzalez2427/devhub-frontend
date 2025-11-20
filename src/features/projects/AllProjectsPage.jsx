// src/features/projects/AllProjectsPage.jsx
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const ALL_PROJECTS_QUERY = gql`
  query AllProjects {
    projects {
      id
      name
      description
      tasks {
        id
        status
      }
    }
  }
`;

export function AllProjectsPage() {
  const { data, loading, error } = useQuery(ALL_PROJECTS_QUERY);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>Error loading projects: {error.message}</p>;
  }

  const projects = data?.projects ?? [];

  if (projects.length === 0) {
    return <p>No projects found.</p>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>All Projects</h2>

      <div className="projects-grid">
        {projects.map((project) => {
          const tasks = project.tasks || [];
          const total = tasks.length;
          const pending = tasks.filter((t) => t.status === "pending").length;
          const inProgress = tasks.filter(
            (t) => t.status === "in_progress"
          ).length;
          const done = tasks.filter((t) => t.status === "done").length;

          return (
            <div key={project.id} className="card project-card">
              <div className="card-header">
                <h3 className="card-title">{project.name}</h3>
                <span className="badge badge-muted">
                  {total === 1 ? "1 task" : `${total} tasks`}
                </span>
              </div>

              <p className="card-body-text">
                {project.description || "No description provided."}
              </p>

              {/* Resumen de estados */}
              <div className="project-stats">
                <span className="project-stat-pill">
                  Pending: <strong>{pending}</strong>
                </span>
                <span className="project-stat-pill">
                  In progress: <strong>{inProgress}</strong>
                </span>
                <span className="project-stat-pill">
                  Done: <strong>{done}</strong>
                </span>
              </div>

              <div style={{ marginTop: "12px" }}>
                <Link
                  to={`/projects/${project.id}`}
                  className="button button-outline"
                >
                  View project detail
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
