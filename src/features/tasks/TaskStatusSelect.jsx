import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useToast } from "../ui/ToastProvider";


const CHANGE_TASK_STATUS_MUTATION = gql`
  mutation ChangeTaskStatus($id: ID!, $status: String!) {
    changeTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export function TaskStatusSelect({ task, onStatusChanged }) {
  const [serverError, setServerError] = useState(null);
  const { showToast } = useToast();

  const [changeStatus, { loading }] = useMutation(
    CHANGE_TASK_STATUS_MUTATION,
    {
      refetchQueries: ["ActivitiesForTask"],
      awaitRefetchQueries: false,
    }
  );

  async function handleChange(e) {
    const newStatus = e.target.value;

    try {
      const { data } = await changeStatus({
        variables: {
          id: Number(task.id),
          status: newStatus,
        },
      });

      if (data?.changeTaskStatus) {
        setServerError(null);
        onStatusChanged?.();
        showToast?.("Task status updated"); // 👈 toast de éxito
      } else {
        setServerError("Could not change status.");
      }
    } catch (err) {
      setServerError(err.message || "Error changing status.");
    }
  }

  return (
    <span style={{ marginLeft: "8px" }}>
      <select
        value={task.status}
        onChange={handleChange}
        disabled={loading}
        className={loading ? "select-loading" : ""}
        style={{ padding: "4px" }}
      >
        <option value="pending">pending</option>
        <option value="in_progress">in_progress</option>
        <option value="done">done</option>
      </select>

      {serverError && (
        <span style={{ color: "red", marginLeft: "8px" }}>
          {serverError}
        </span>
      )}
    </span>
  );
}
