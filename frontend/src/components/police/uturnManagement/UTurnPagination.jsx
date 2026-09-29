import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../../styles/uturnManagement.css';

export const UTurnPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}) => {
  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="uturn-pagination-wrap">
      <div className="uturn-pagination-info">
        Showing <strong>{startIdx}</strong> to <strong>{endIdx}</strong> of <strong>{totalItems}</strong> entries
      </div>

      <div className="uturn-pagination-controls">
        {onPageSizeChange && (
          <div className="uturn-pagesize-select-wrap">
            <span className="uturn-pagesize-label">Rows per page:</span>
            <select
              className="uturn-pagesize-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <div className="uturn-page-buttons">
          <button
            type="button"
            className="btn-page-nav"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="uturn-current-page-badge">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            type="button"
            className="btn-page-nav"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UTurnPagination;
