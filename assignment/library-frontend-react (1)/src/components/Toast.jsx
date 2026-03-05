import React from "react";

export default function Toast({ message, type = "info", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__msg">{message}</div>
      <button className="btn btn--ghost" onClick={onClose}>✕</button>
    </div>
  );
}
