import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../../styles/userManagement.css';

const UserPagination = ({ currentPage, totalPages = 1, totalItems = 9, onPageChange }) => {
  return (
    <div className="user-pagination-bar">
      <span className="user-showing-text">
        Showing 1 to {totalItems} of {totalItems} users
      </span>

      <div className="user-pagination-controls">
        <button
          className="usr-pg-btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          title="Previous Page"
        >
          <ChevronLeft size={13} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            className={`usr-pg-btn${currentPage === pg ? ' active' : ''}`}
            onClick={() => onPageChange(pg)}
          >
            {pg}
          </button>
        ))}

        <button
          className="usr-pg-btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          title="Next Page"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default UserPagination;
