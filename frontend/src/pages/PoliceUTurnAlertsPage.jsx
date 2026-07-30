import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import UTurnAlertSummaryCards from '../components/police/UTurnAlertSummaryCards';
import UTurnAlertFilter from '../components/police/UTurnAlertFilter';
import UTurnAlertTable from '../components/police/UTurnAlertTable';
import UTurnAlertPriorityChart from '../components/police/UTurnAlertPriorityChart';
import UTurnAlertWeeklyChart from '../components/police/UTurnAlertWeeklyChart';
import UTurnRecentNotifications from '../components/police/UTurnRecentNotifications';
import {
  mockUTurnAlertsData,
  mockUTurnPriorityDistribution,
  mockUTurnWeeklyOverview,
  mockUTurnRecentNotifications,
} from '../data/uTurnAlertsMockData';
import '../styles/police-dashboard.css';
import '../styles/uTurnAlerts.css';

export const PoliceUTurnAlertsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredAlerts = useMemo(() => {
    if (priorityFilter === 'all') return mockUTurnAlertsData;
    return mockUTurnAlertsData.filter(
      (item) => item.priority.toLowerCase() === priorityFilter.toLowerCase()
    );
  }, [priorityFilter]);

  const handleReset = () => {
    setPriorityFilter('all');
  };

  const handleExport = () => {
    alert('Export feature coming soon.');
  };

  const statsSummary = useMemo(() => {
    return { total: 126, high: 54, medium: 42, low: 30 };
  }, []);

  // Adapt weekly data for chart (rename 'count' to 'alerts')
  const weeklyChartData = mockUTurnWeeklyOverview.map((d) => ({
    day: d.day,
    alerts: d.count,
  }));

  // Adapt notifications for display
  const notificationItems = mockUTurnRecentNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    desc: n.desc,
    time: n.time,
    priority: n.priority,
  }));

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

        {/* Page Content */}
        <main className="uturn-alerts-container">
          {/* Page Title & Breadcrumb */}
          <div className="uturn-alerts-header-section">
            <h1 className="uturn-alerts-page-title">U-Turn Alerts</h1>
            <nav className="uturn-alerts-breadcrumb">
              <Link to="/police/dashboard">Dashboard</Link>
              <span className="breadcrumb-separator">&gt;</span>
              <span className="breadcrumb-current">U-Turn Alerts</span>
            </nav>
          </div>

          {/* 4 KPI Summary Cards */}
          <UTurnAlertSummaryCards stats={statsSummary} />

          {/* Filter Toolbar */}
          <UTurnAlertFilter
            priority={priorityFilter}
            onPriorityChange={setPriorityFilter}
            onReset={handleReset}
            onExport={handleExport}
          />

          {/* Main Two-Column Layout */}
          <div className="uturn-alerts-main-grid">
            {/* Left: Table */}
            <div style={{ minWidth: 0 }}>
              <UTurnAlertTable alerts={filteredAlerts} />
            </div>

            {/* Right: Analytics Widgets */}
            <div className="uturn-alerts-right-column">
              <UTurnAlertPriorityChart distribution={mockUTurnPriorityDistribution} />
              <UTurnAlertWeeklyChart weeklyData={weeklyChartData} />
              <UTurnRecentNotifications notifications={notificationItems} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PoliceUTurnAlertsPage;
