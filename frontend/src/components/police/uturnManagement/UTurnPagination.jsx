import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../../styles/uturnManagement.css';

const UTurnPagination = ({
  currentPage = 1,
  totalPages = 5,
  totalItems = 48,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="uturn-pagination-container">
      {/* Showing count */}
      <div className="uturn-pagination-info">
        Showing {startItem} to {endItem} of {totalItems} U-turn units
      </div>

      {/* Controls */}
      <div className="uturn-pagination-controls">
        <button
          type="button"
          className="btn-page-nav"
          disabled={currentPage === 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>

        {[1, 2, 3, 4, 5].map((p) => (
          <button
            key={p}
            type="button"
            className={`btn-page-num ${p === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange && onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="btn-page-nav"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Rows per page select */}
      <div className="uturn-rows-per-page">
        <span>Rows per page</span>
        <select
          className="uturn-filter-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
          style={{ padding: '0.35rem 1.75rem 0.35rem 0.65rem', fontSize: '0.8rem' }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default UTurnPagination;
