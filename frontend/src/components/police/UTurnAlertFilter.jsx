import React from 'react';
import { Filter, Download } from 'lucide-react';
import '../../styles/uTurnAlerts.css';

const UTurnAlertFilter = ({ priority, onPriorityChange, onReset, onExport, exporting = false, priorities = ['High', 'Medium', 'Low'] }) => {
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
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-right-group">
        <button className="btn-reset" onClick={onReset} type="button">
          Reset
        </button>
        <button
          className="btn-export"
          onClick={onExport}
          disabled={exporting}
          type="button"
        >
          <Download size={14} />
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>
    </div>
  );
};

export default UTurnAlertFilter;
