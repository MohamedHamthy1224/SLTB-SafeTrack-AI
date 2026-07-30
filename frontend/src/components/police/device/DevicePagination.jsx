import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../../styles/deviceManagement.css';

const TOTAL_PAGES = 15;

const DevicePagination = ({ currentPage, onPageChange, totalDevices, rowsPerPage, onRowsChange }) => {
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalDevices);

  // Build visible page buttons: 1 2 3 4 5 ... 15
  const getPageButtons = () => {
    const pages = [];
    if (TOTAL_PAGES <= 7) {
      for (let i = 1; i <= TOTAL_PAGES; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', TOTAL_PAGES);
      } else if (currentPage >= TOTAL_PAGES - 3) {
        pages.push(1, '...', TOTAL_PAGES - 4, TOTAL_PAGES - 3, TOTAL_PAGES - 2, TOTAL_PAGES - 1, TOTAL_PAGES);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', TOTAL_PAGES);
      }
    }
    return pages;
  };

  return (
    <div className="device-pagination-bar">
      <span className="pagination-showing-text">
        Showing {startItem} to {endItem} of {totalDevices} devices
      </span>

      <div className="pagination-controls-group">
        <button
          className="pg-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={13} />
        </button>

        {getPageButtons().map((pg, idx) =>
          pg === '...' ? (
            <span key={`ellipsis-${idx}`} className="pg-ellipsis">…</span>
          ) : (
            <button
              key={pg}
              className={`pg-btn ${currentPage === pg ? 'active' : ''}`}
              onClick={() => onPageChange(pg)}
            >
              {pg}
            </button>
          )
        )}

        <button
          className="pg-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === TOTAL_PAGES}
        >
          <ChevronRight size={13} />
        </button>
      </div>

      <div className="rows-per-page-group">
        <span>Rows per page</span>
        <select
          className="rows-per-page-select"
          value={rowsPerPage}
          onChange={(e) => onRowsChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default DevicePagination;
