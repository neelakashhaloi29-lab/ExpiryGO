import React from 'react';

function DashboardCard({ title, description, children, className = '' }) {
  return (
    <article className={`card ${className}`.trim()}>
      <div className="card-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </article>
  );
}

export default DashboardCard;
