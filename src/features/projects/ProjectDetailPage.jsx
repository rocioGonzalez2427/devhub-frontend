// src/features/projects/ProjectDetailPage.jsx
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { NewTaskForm } from "../tasks/NewTaskForm";
import { TaskStatusSelect } from "../tasks/TaskStatusSelect";
import { AssignTaskSelect } from "../tasks/AssignTaskSelect";
import { TaskActivityFeed } from "../activities/TaskActivityFeed";
import { TaskStatusBadge } from "../tasks/TaskStatusBadge";

const PROJECT_QUERY = gql`
  query Project($id: ID!) {
    project(id: $id) {
      id
      name
      description
      tasks {
        id
        title
        status
        assignee {
          id
          email
        }
      }
    }
  }
`;

export function ProjectDetailPage() {
  const { projectId } = useParams();

  const { data, loading, error, refetch } = useQuery(PROJECT_QUERY, {
    variables: { id: projectId },
  });

  if (loading) return <p>Loading project...</p>;
  if (error) return <p>Error loading project: {error.message}</p>;

  const project = data.project;

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div className="project-page">
      {/* Card de info del proyecto */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{project.name}</h2>
        </div>
        <p className="card-body-text">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Card de tasks */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tasks</h3>
        </div>

        {project.tasks.length === 0 ? (
          <p className="card-body-text">No tasks yet.</p>
        ) : (
          <div>
            {project.tasks.map((task) => (
              <div key={task.id} className="task-card">
                {/* Header de la tarjeta de task */}
                <div className="task-card-header">
                  <div>
                    <div className="task-card-title">{task.title}</div>
                    {/* Badge de status debajo del título */}
                    <div style={{ marginTop: "4px" }}>
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </div>

                  {/* Controles a la derecha */}
                  <div className="task-card-controls">
                    <TaskStatusSelect
                      task={task}
                      onStatusChanged={() => refetch()}
                    />

                    <AssignTaskSelect
                      task={task}
                      onAssigned={() => refetch()}
                    />
                  </div>
                </div>

                {/* Línea de assignee */}
                {task.assignee && (
                  <div className="task-card-sub">
                    Assigned to: {task.assignee.email}
                  </div>
                )}

                {/* Activity feed */}
                <TaskActivityFeed taskId={task.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card para crear nuevas tasks */}
      <div className="card">
        <NewTaskForm
          projectId={project.id}
          onTaskCreated={() => refetch()}
        />
      </div>

      <p style={{ marginTop: "8px" }}>
        <Link to="/projects" className="back-link">
          ← Back to projects
        </Link>
      </p>
    </div>
  );
}
