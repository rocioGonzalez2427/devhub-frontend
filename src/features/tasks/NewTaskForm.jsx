import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useToast } from "../ui/ToastProvider";


const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($projectId: ID!, $title: String!) {
    createTask(projectId: $projectId, title: $title) {
      id
      title
      status
    }
  }
`;

export function NewTaskForm({ projectId, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [serverError, setServerError] = useState(null);
  const { showToast } = useToast();

  const [createTask, { loading, error }] = useMutation(CREATE_TASK_MUTATION);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const { data } = await createTask({
        variables: {
          projectId: Number(projectId),
          title,
        },
      });

      if (data?.createTask) {
        setServerError(null);
        setTitle("");
        onTaskCreated?.();
        showToast?.("Task created");
      } else {
        setServerError("Could not create task.");
      }
    } catch (err) {
      setServerError(err.message || "Error creating task.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="card-title" style={{ marginBottom: "8px" }}>
        Create new task
      </h4>

      <input
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", width: "60%", marginRight: "8px" }}
      />

      <button
        type="submit"
        disabled={loading}
        className={`button button-primary ${
          loading ? "button-loading" : ""
        }`}
      >
        {loading ? "Creating..." : "Create Task"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "8px" }}>
          {error.message}
        </p>
      )}

      {serverError && !error && (
        <p style={{ color: "red", marginTop: "8px" }}>
          {serverError}
        </p>
      )}
    </form>
  );
}
