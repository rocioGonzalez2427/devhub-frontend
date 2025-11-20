import React from "react";

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In progress",
  done: "Done",
};

export function TaskStatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`status-badge status-${status}`}>
      {label}
    </span>
  );
}
