// src/features/activities/TaskActivityFeed.jsx
import React from "react";
import { gql, useQuery } from "@apollo/client";

const ACTIVITIES_QUERY = gql`
  query ActivitiesForTask($taskId: ID!) {
    activities(taskId: $taskId) {
      id
      action
      createdAt
    }
  }
`;

// Etiquetas más amigables (opcional)
const ACTION_LABELS = {
  created: "Task created",
  updated: "Task updated",
  status_changed: "Status changed",
  assigned: "Assigned",
  unassigned: "Unassigned",
};

export function TaskActivityFeed({ taskId }) {
  const { data, loading, error } = useQuery(ACTIVITIES_QUERY, {
    variables: { taskId: Number(taskId) },
  });

  if (loading) {
    return <p style={{ fontSize: "0.9rem" }}>Loading activity...</p>;
  }

  if (error) {
    return (
      <p style={{ fontSize: "0.9rem", color: "red" }}>
        Error loading activity: {error.message}
      </p>
    );
  }

  const activities = data?.activities ?? [];

  if (activities.length === 0) {
    return (
      <p style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
        No activity yet for this task.
      </p>
    );
  }

  // 👉 Encontrar la actividad más reciente (para resaltarla)
  const latestActivity = activities.reduce((latest, current) => {
    if (!latest) return current;
    return new Date(current.createdAt) > new Date(latest.createdAt)
      ? current
      : latest;
  }, null);
  const latestId = latestActivity?.id;

  // Agrupar por fecha (YYYY-MM-DD)
  const groups = activities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt);
    const dateKey = date.toISOString().slice(0, 10); // 2025-11-19

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(activity);
    return acc;
  }, {});

  const todayKey = new Date().toISOString().slice(0, 10);
  const sortedKeys = Object.keys(groups).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="activity-block">
      {sortedKeys.map((dateKey) => {
        const items = groups[dateKey].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        );

        const header =
          dateKey === todayKey
            ? "Today"
            : new Date(dateKey).toLocaleDateString();

        return (
          <div key={dateKey} style={{ marginBottom: "4px" }}>
            <p className="activity-title">
              <strong>{header}</strong>
            </p>
            <ul className="activity-list">
              {items.map((activity) => {
                const isLatest = activity.id === latestId;
                const label =
                  ACTION_LABELS[activity.action] || activity.action;

                return (
                  <li
                    key={activity.id}
                    className={
                      "activity-item" +
                      (isLatest ? " activity-item-new" : "")
                    }
                  >
                    {label} —{" "}
                    <span style={{ color: "#6b7280" }}>
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
