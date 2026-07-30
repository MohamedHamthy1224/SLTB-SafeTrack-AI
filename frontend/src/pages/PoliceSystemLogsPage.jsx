import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import SystemLogSummaryCards from '../components/police/systemLogs/SystemLogSummaryCards';
import SystemLogFilterBar from '../components/police/systemLogs/SystemLogFilterBar';
import SystemLogTable from '../components/police/systemLogs/SystemLogTable';
import SystemLogPagination from '../components/police/systemLogs/SystemLogPagination';
import ActivityChart from '../components/police/systemLogs/ActivityChart';
import UserDistributionChart from '../components/police/systemLogs/UserDistributionChart';
import RecentActivitiesCard from '../components/police/systemLogs/RecentActivitiesCard';
import {
  systemLogsSummaryStats,
  mockSystemLogs,
  mockActivityByDay,
  mockUserDistribution,
  mockRecentActivities,
  mockUserOptions,
} from '../data/systemLogsMockData';
import '../styles/police-dashboard.css';
import '../styles/systemLogs.css';

const ITEMS_PER_PAGE = 10;

export const PoliceSystemLogsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState('All Users');
  const [currentPage, setCurrentPage] = useState(1);

  // Applied filter state
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedUser, setAppliedUser] = useState('All Users');

  const filteredLogs = useMemo(() => {
    return mockSystemLogs.filter((log) => {
      const matchSearch =
        !appliedSearch ||
        log.activity.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        log.userId.toLowerCase().includes(appliedSearch.toLowerCase());
      const matchUser =
        appliedUser === 'All Users' || log.userId === appliedUser;
      return matchSearch && matchUser;
    });
  }, [appliedSearch, appliedUser]);

  const handleReset = () => {
    setSearchValue('');
    setSelectedUser('All Users');
    setAppliedSearch('');
    setAppliedUser('All Users');
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Frontend-only: no-op for now
  };

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="police-dashboard-main">
        <PoliceDashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="syslog-container">
          {/* Page Header */}
          <div className="syslog-header-section">
            <h1 className="syslog-page-title">System Logs</h1>
            <nav className="syslog-breadcrumb">
              <Link to="/police/dashboard">
                Dashboard
              </Link>
              <span className="bc-sep">&gt;</span>
              <span className="bc-current">
                <FileText size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                System Logs
              </span>
            </nav>
          </div>

          {/* Summary Cards */}
          <SystemLogSummaryCards stats={systemLogsSummaryStats} />

          {/* Filter Bar */}
          <SystemLogFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedUser={selectedUser}
            onUserChange={setSelectedUser}
            userOptions={mockUserOptions}
            dateRange="01 Jun 2025 - 05 Jun 2025"
            onReset={handleReset}
            onExport={handleExport}
          />

          {/* System Logs Table */}
          <SystemLogTable logs={filteredLogs} />

          {/* Pagination */}
          <SystemLogPagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={systemLogsSummaryStats.totalActivities}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {/* Bottom Analytics Row */}
          <div className="syslog-analytics-grid" style={{ marginTop: '1.15rem' }}>
            <ActivityChart data={mockActivityByDay} />
            <UserDistributionChart
              data={mockUserDistribution}
              totalActivities={systemLogsSummaryStats.totalActivities}
            />
            <RecentActivitiesCard activities={mockRecentActivities} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PoliceSystemLogsPage;
