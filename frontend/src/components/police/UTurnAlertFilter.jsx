import React from 'react';
import { Filter, Download } from 'lucide-react';
import '../../styles/uTurnAlerts.css';

const UTurnAlertFilter = ({ priority, onPriorityChange, onReset, onExport }) => {
  return (
    <div className="uturn-alerts-filter-bar">
      <div className="filter-left-group">
        <Filter size={15} color="#475569" />
        <span className="filter-label">Filter by Priority:</span>
        <select
          className="filter-select"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="filter-right-group">
        <button className="btn-reset" onClick={onReset}>
          Reset
        </button>
        <button className="btn-export" onClick={onExport}>
          <Download size={14} />
          Export
        </button>
      </div>
    </div>
  );
};

export default UTurnAlertFilter;
