import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ReportPagination = ({
  page,
  perPage,
  totalItems,
  totalPages,
  onPageChange,
  onPerPageChange
}) => {
  if (totalItems === 0) return null;

  const startRecord = (page - 1) * perPage + 1;
  const endRecord = Math.min(page * perPage, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="report-pagination-container">
      <div className="per-page-selector">
        <label htmlFor="per-page-select">Rows per page:</label>
        <select
          id="per-page-select"
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="pagination-info">
        <span>
          {startRecord}–{endRecord} of {totalItems}
        </span>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((p, idx) => (
            <button
              key={idx}
              className={`pagination-num-btn ${p === page ? 'active' : ''} ${p === '...' ? 'dots' : ''}`}
              disabled={p === '...'}
              onClick={() => typeof p === 'number' && onPageChange(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPagination;
