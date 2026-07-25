import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const RoutePagination = ({
  pagination = {},
  onPageChange,
  onPerPageChange,
  loading = false
}) => {
  const {
    page = 1,
    perPage = 10,
    totalItems = 0,
    totalPages = 1
  } = pagination;

  if (totalItems <= 0) return null;

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalItems);

  // Generate page numbers range with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="route-pagination-container">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> routes
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn nav-btn"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          title="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }
          return (
            <button
              key={`page-${p}`}
              className={`pagination-btn page-num-btn ${p === page ? 'active' : ''}`}
              disabled={loading}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          );
        })}

        <button
          className="pagination-btn nav-btn"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          title="Next Page"
        >
          <ChevronRight size={18} />
        </button>

        <div className="per-page-selector-wrapper">
          <span className="per-page-label">Rows per page</span>
          <select
            className="per-page-select"
            value={perPage}
            disabled={loading}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RoutePagination;
