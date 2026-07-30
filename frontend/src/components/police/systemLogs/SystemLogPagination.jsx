import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../../styles/systemLogs.css';

const TOTAL_PAGES = 1285;
const VISIBLE_PAGES = [1, 2, 3, 4, 5];

const SystemLogPagination = ({ currentPage, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="syslog-table-footer">
      <span className="syslog-showing-text">
        Showing {startItem} to {endItem} of {totalItems.toLocaleString()} activities
      </span>

      <div className="syslog-pagination-controls">
        {/* Previous */}
        <button
          className="sl-pg-btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          title="Previous"
        >
          <ChevronLeft size={13} />
        </button>

        {/* Page buttons */}
        {VISIBLE_PAGES.map((pg) => (
          <button
            key={pg}
            className={`sl-pg-btn${currentPage === pg ? ' active' : ''}`}
            onClick={() => onPageChange(pg)}
          >
            {pg}
          </button>
        ))}

        <span className="sl-pg-ellipsis">…</span>

        <button
          className={`sl-pg-btn${currentPage === TOTAL_PAGES ? ' active' : ''}`}
          onClick={() => onPageChange(TOTAL_PAGES)}
        >
          {TOTAL_PAGES.toLocaleString()}
        </button>

        {/* Next */}
        <button
          className="sl-pg-btn"
          onClick={() => onPageChange(Math.min(TOTAL_PAGES, currentPage + 1))}
          disabled={currentPage === TOTAL_PAGES}
          title="Next"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default SystemLogPagination;
