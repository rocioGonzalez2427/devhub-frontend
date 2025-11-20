// src/features/tasks/AssignTaskSelect.jsx
import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useToast } from "../ui/ToastProvider";

const ALL_USERS_QUERY = gql`
  query AllUsers {
    allUsers {
      id
      email
    }
  }
`;

const ASSIGN_TASK_MUTATION = gql`
  mutation AssignTask($taskId: ID!, $assigneeId: ID!) {
    assignTask(taskId: $taskId, assigneeId: $assigneeId) {
      id
      status
      assignee {
        id
        email
      }
    }
  }
`;

export function AssignTaskSelect({ task, onAssigned }) {
  const { data, loading, error } = useQuery(ALL_USERS_QUERY);
  const [assignTask, { loading: assigning }] = useMutation(
    ASSIGN_TASK_MUTATION
  );
  const { showToast } = useToast();

  const [localAssigneeId, setLocalAssigneeId] = useState(
    task.assignee ? task.assignee.id : ""
  );

  if (loading) {
    return <span style={{ fontSize: "0.85rem" }}>Loading users...</span>;
  }

  if (error) {
    return (
      <span style={{ fontSize: "0.85rem", color: "red" }}>
        Error loading users
      </span>
    );
  }

  const users = data?.allUsers ?? [];

  const handleChange = async (e) => {
    const newAssigneeId = e.target.value;
    setLocalAssigneeId(newAssigneeId);

    if (!newAssigneeId) {
      // Si quisieras soportar "Unassigned" deberíamos tener otra mutation.
      return;
    }

    try {
      await assignTask({
        variables: {
          taskId: task.id,
          assigneeId: newAssigneeId, // 👈 nombre correcto según el schema
        },
      });

      showToast?.("Task assignee updated");
      onAssigned?.();
    } catch (err) {
      console.error(err);
      showToast?.("Error updating assignee");
    }
  };

  return (
    <select
      value={localAssigneeId}
      onChange={handleChange}
      disabled={assigning}
      style={{ padding: "4px 8px" }}
    >
      <option value="">Select user…</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.email}
        </option>
      ))}
    </select>
  );
}
