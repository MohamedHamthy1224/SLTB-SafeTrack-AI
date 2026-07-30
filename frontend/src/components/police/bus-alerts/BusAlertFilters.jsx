import React from 'react';
import { Download } from 'lucide-react';
import '../../../styles/bus-alerts.css';

export const BusAlertFilters = ({ priorityFilter, onPriorityChange, onReset }) => {
  return (
    <div className="bus-alerts-filter-bar">
      <div className="filter-left-group">
        <span className="filter-label">Priority</span>
        <select 
          className="filter-select"
          value={priorityFilter || 'All'}
          onChange={(e) => onPriorityChange && onPriorityChange(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="filter-right-group">
        <button 
          className="btn-reset" 
          onClick={onReset}
          type="button"
        >
          Reset
        </button>

        <button 
          className="btn-export" 
          onClick={() => alert('Exporting bus alerts dataset...')}
          type="button"
        >
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default BusAlertFilters;
