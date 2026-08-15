import React from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

export const ReportExportButton = ({
  onExport,
  onExportCSV,
  onExportPDF,
  disabled = false,
  csvLoading = false,
  pdfLoading = false
}) => {
  const handleCSV = onExportCSV || onExport;

  return (
    <div className="report-export-button-group">
      {handleCSV && (
        <button
          type="button"
          className="report-export-btn csv-btn"
          onClick={handleCSV}
          disabled={disabled || csvLoading || pdfLoading}
          title="Export report to CSV / Excel spreadsheet"
          aria-label="Export CSV / Excel Report"
        >
          {csvLoading ? (
            <>
              <Loader2 size={15} className="spin-icon" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download size={15} />
              <span>Export CSV</span>
            </>
          )}
        </button>
      )}

      {onExportPDF && (
        <button
          type="button"
          className="report-export-btn pdf-btn"
          onClick={onExportPDF}
          disabled={disabled || pdfLoading || csvLoading}
          title="Export report to professional PDF document"
          aria-label="Export PDF Report"
        >
          {pdfLoading ? (
            <>
              <Loader2 size={15} className="spin-icon" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <FileText size={15} />
              <span>Export PDF</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ReportExportButton;
