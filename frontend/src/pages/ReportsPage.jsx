import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { ReportTabs } from '../components/reports/ReportTabs';
import { BusesReport } from '../components/reports/buses/BusesReport';
import { RoutesReport } from '../components/reports/routes/RoutesReport';
import { DriversReport } from '../components/reports/drivers/DriversReport';
import { AssignmentHistoryReport } from '../components/reports/assignments/AssignmentHistoryReport';
import { SensorsAlertsReport } from '../components/reports/alerts/SensorsAlertsReport';
import { ReportLoadingSkeleton } from '../components/reports/common/ReportLoadingSkeleton';
import { ReportErrorState } from '../components/reports/common/ReportErrorState';
import { useReports } from '../hooks/useReports';
import { useReportSocket } from '../hooks/useReportSocket';
import { AlertCircle } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/reports.css';

export const ReportsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    activeTab,
    handleTabChange,
    loading,
    error,
    summary,
    items,
    filterOptions,
    lastUpdated,
    page,
    setPage,
    perPage,
    setPerPage,
    totalItems,
    totalPages,
    sortBy,
    order,
    handleSort,
    filters,
    handleFilterChange,
    handleResetFilters,
    handleExportCSV,
    refetchActiveReport
  } = useReports();

  const { socketStatus } = useReportSocket(activeTab, refetchActiveReport);

  // Derive socket status label and class
  const statusLabel = socketStatus === 'live' ? 'Live'
    : socketStatus === 'reconnecting' ? 'Reconnecting'
    : 'Offline';

  const statusDotClass = socketStatus === 'live' ? 'live'
    : socketStatus === 'reconnecting' ? 'reconnecting'
    : 'offline';

  // Shared props for all report components
  const sharedProps = {
    summary,
    items,
    filterOptions,
    filters,
    onFilterChange: handleFilterChange,
    onResetFilters: handleResetFilters,
    page,
    perPage,
    totalItems,
    totalPages,
    onPageChange: setPage,
    onPerPageChange: (val) => { setPerPage(val); setPage(1); },
    sortBy,
    order,
    onSort: handleSort,
    onExportCSV: handleExportCSV
  };

  const renderReport = () => {
    if (loading) {
      const cardCounts = {
        buses: 4,
        routes: 4,
        drivers: 3,
        'assignment-history': 2,
        'sensors-alerts': 1
      };
      return <ReportLoadingSkeleton cardCount={cardCounts[activeTab] || 4} />;
    }

    if (error) {
      return <ReportErrorState message={error} onRetry={refetchActiveReport} />;
    }

    switch (activeTab) {
      case 'buses':
        return <BusesReport {...sharedProps} />;
      case 'routes':
        return <RoutesReport {...sharedProps} />;
      case 'drivers':
        return <DriversReport {...sharedProps} />;
      case 'assignment-history':
        return <AssignmentHistoryReport {...sharedProps} />;
      case 'sensors-alerts':
        return <SensorsAlertsReport {...sharedProps} />;
      default:
        return <BusesReport {...sharedProps} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content">
          <div className="reports-page-container">
            {/* Page Header */}
            <div className="reports-page-header">
              <div>
                <h1>Reports</h1>
                <p>View and export operational reports for buses, routes, drivers, assignments, sensors and alerts.</p>
              </div>

              <div className="report-live-status">
                <div className={`socket-status-badge ${statusDotClass}`}>
                  <span className={`socket-status-dot ${statusDotClass}`} />
                  {statusLabel}
                </div>
                {lastUpdated && (
                  <span className="report-last-updated">
                    Last updated: {lastUpdated}
                  </span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <ReportTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Report Content */}
            {renderReport()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
