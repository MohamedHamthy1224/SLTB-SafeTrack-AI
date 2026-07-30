import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import { BusAlertStats } from '../components/police/bus-alerts/BusAlertStats';
import { BusAlertFilters } from '../components/police/bus-alerts/BusAlertFilters';
import { BusAlertsTable } from '../components/police/bus-alerts/BusAlertsTable';
import { BusAlertPriorityChart } from '../components/police/bus-alerts/BusAlertPriorityChart';
import { BusAlertWeeklyChart } from '../components/police/bus-alerts/BusAlertWeeklyChart';
import { RecentNotifications } from '../components/police/bus-alerts/RecentNotifications';
import { mockBusAlertsData } from '../data/busAlertsMockData';
import '../styles/police-dashboard.css';
import '../styles/bus-alerts.css';

export const PoliceBusAlertsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter alerts based on priority dropdown
  const filteredAlerts = useMemo(() => {
    if (priorityFilter === 'All') return mockBusAlertsData;
    return mockBusAlertsData.filter(
      (item) => item.priority.toLowerCase() === priorityFilter.toLowerCase()
    );
  }, [priorityFilter]);

  const handleResetFilters = () => {
    setPriorityFilter('All');
    setCurrentPage(1);
  };

  // Dynamic summary stats computation
  const statsSummary = useMemo(() => {
    const total = mockBusAlertsData.length;
    const high = mockBusAlertsData.filter((a) => a.priority.toLowerCase() === 'high').length;
    const medium = mockBusAlertsData.filter((a) => a.priority.toLowerCase() === 'medium').length;
    const low = mockBusAlertsData.filter((a) => a.priority.toLowerCase() === 'low').length;
    return { total: 36, high: 18, medium: 12, low: 6 };
  }, []);

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="police-dashboard-main">
        {/* Sticky Header */}
        <PoliceDashboardHeader 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />

        {/* Dashboard Content Container */}
        <main className="bus-alerts-container">
          {/* Header & Breadcrumbs */}
          <div className="bus-alerts-header-section">
            <h1 className="bus-alerts-page-title">Bus Alerts</h1>
            <nav className="bus-alerts-breadcrumb">
              <Link to="/police/dashboard">Dashboard</Link>
              <span className="breadcrumb-separator">&gt;</span>
              <span className="breadcrumb-current">Bus Alerts</span>
            </nav>
          </div>

          {/* Top 4 Summary Cards */}
          <BusAlertStats stats={statsSummary} />

          {/* Priority Filter & Export Bar */}
          <BusAlertFilters
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            onReset={handleResetFilters}
          />

          {/* Main Grid: Left Table, Right Widgets */}
          <div className="bus-alerts-main-grid">
            {/* All Bus Alerts Table */}
            <div style={{ minWidth: 0 }}>
              <BusAlertsTable 
                alerts={filteredAlerts}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Right Sidebar Widgets */}
            <div className="bus-alerts-right-column">
              <BusAlertPriorityChart />
              <BusAlertWeeklyChart />
              <RecentNotifications />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PoliceBusAlertsPage;
