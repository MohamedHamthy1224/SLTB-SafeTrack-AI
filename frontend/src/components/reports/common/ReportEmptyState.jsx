import React from 'react';
import { FileX } from 'lucide-react';

export const ReportEmptyState = ({ message = "No report data matches the selected filters." }) => {
  return (
    <div className="report-empty-state">
      <FileX size={42} className="empty-icon" />
      <h4>No Results Found</h4>
      <p>{message}</p>
    </div>
  );
};

export default ReportEmptyState;
