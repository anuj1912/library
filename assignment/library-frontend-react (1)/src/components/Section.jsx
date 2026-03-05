import React from "react";

export default function Section({ title, subtitle, children, actions }) {
  return (
    <section className="card">
      <div className="card__header">
        <div>
          <h2 className="card__title">{title}</h2>
          {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
        </div>
        <div className="card__actions">{actions}</div>
      </div>
      <div className="card__content">{children}</div>
    </section>
  );
}
