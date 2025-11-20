import React from "react";
import { gql, useQuery } from "@apollo/client";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskActivityFeed } from "../activities/TaskActivityFeed";
import { TaskStatusBadge } from "./TaskStatusBadge";

const MY_TASKS_QUERY = gql`
  query MyTasks {
    myTasks {
      id
      title
      status
      project {
        id
        name
      }
      assignee {
        id
        email
      }
    }
  }
`;

export default function MyTasksPage() {
  const { data, loading, error, refetch } = useQuery(MY_TASKS_QUERY);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  const tasks = data?.myTasks ?? [];

  if (tasks.length === 0) {
    return (
      <div className="card">
        <p className="card-body-text">You have no assigned tasks.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>My Tasks</h2>

      {tasks.map((task) => (
        <div className="card" key={task.id}>
          <div className="card-header">
            <h3 className="card-title">{task.title}</h3>

            {/* Badge + selector de status */}
            <div className="task-meta">
              <TaskStatusBadge status={task.status} />
              <TaskStatusSelect
                task={task}
                onStatusChanged={() => refetch()}
              />
            </div>
          </div>

          <p className="card-body-text">
            Project: <strong>{task.project.name}</strong>
          </p>

          <p className="card-body-text" style={{ marginTop: "4px" }}>
            Assigned to:{" "}
            <span className="badge badge-muted">
              {task.assignee?.email}
            </span>
          </p>

          <div className="activity-block" style={{ marginTop: "8px" }}>
            <TaskActivityFeed taskId={task.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
