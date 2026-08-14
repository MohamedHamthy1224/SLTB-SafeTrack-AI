import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ReportErrorState = ({
  message = "Unable to load the requested report at the moment.",
  onRetry
}) => {
  return (
    <div className="report-error-state">
      <AlertCircle size={42} className="error-icon" />
      <h4>Error Loading Report</h4>
      <p>{message}</p>
      {onRetry && (
        <button className="report-retry-btn" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ReportErrorState;
