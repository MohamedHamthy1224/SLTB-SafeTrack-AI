import React from 'react';
import { Upload } from 'lucide-react';

export const ReportExportButton = ({ onExport, disabled = false }) => {
  return (
    <button
      className="report-export-btn"
      onClick={onExport}
      disabled={disabled}
      aria-label="Export CSV Report"
    >
      <Upload size={16} />
      <span>Export</span>
    </button>
  );
};

export default ReportExportButton;
