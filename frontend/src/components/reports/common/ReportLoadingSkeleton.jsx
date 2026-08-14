import React from 'react';

export const ReportLoadingSkeleton = ({ cardCount = 4, rowCount = 6, colCount = 8 }) => {
  return (
    <div className="report-loading-skeleton">
      <div className="skeleton-cards-grid">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-icon-placeholder" />
            <div className="skeleton-card-text">
              <div className="skeleton-line short" />
              <div className="skeleton-line long" />
            </div>
          </div>
        ))}
      </div>

      <div className="skeleton-filter-bar">
        <div className="skeleton-line input" />
        <div className="skeleton-line input" />
        <div className="skeleton-line button" />
      </div>

      <div className="skeleton-table-container">
        <div className="skeleton-table-header" />
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="skeleton-table-row">
            {Array.from({ length: colCount }).map((_, j) => (
              <div key={j} className="skeleton-cell" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportLoadingSkeleton;
