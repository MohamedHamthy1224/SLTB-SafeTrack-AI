import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import { BusAlertStats } from '../components/police/bus-alerts/BusAlertStats';
import { BusAlertFilters } from '../components/police/bus-alerts/BusAlertFilters';
import { BusAlertsTable } from '../components/police/bus-alerts/BusAlertsTable';
import { BusAlertPriorityChart } from '../components/police/bus-alerts/BusAlertPriorityChart';
import { BusAlertWeeklyChart } from '../components/police/bus-alerts/BusAlertWeeklyChart';
import { RecentNotifications } from '../components/police/bus-alerts/RecentNotifications';
import policeBusAlertService from '../services/policeBusAlertService';
import '../styles/police-dashboard.css';
import '../styles/bus-alerts.css';

export const PoliceBusAlertsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Live Data States
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState({ total: 0, high: 0, medium: 0, low: 0 });
  const [charts, setCharts] = useState({ priorityDistribution: [], weeklyOverview: [], totalWeeklyAlerts: 0 });
  const [recentNotifications, setRecentNotifications] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const socketRef = useRef(null);

  // Load Bus Alerts and Metadata
  const loadData = useCallback(async (selectedPriority = priorityFilter) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const params = selectedPriority && selectedPriority.toLowerCase() !== 'all' ? { priority: selectedPriority } : {};

      const [alertsRes, summaryRes, chartsRes, recentRes] = await Promise.all([
        policeBusAlertService.getAlerts(params),
        policeBusAlertService.getSummary(),
        policeBusAlertService.getCharts(),
        policeBusAlertService.getRecent(5)
      ]);

      if (alertsRes && alertsRes.data) {
        setAlerts(alertsRes.data.items || alertsRes.data);
      }
      if (summaryRes && summaryRes.data) {
        setSummary(summaryRes.data);
      }
      if (chartsRes && chartsRes.data) {
        setCharts(chartsRes.data);
      }
      if (recentRes && recentRes.data) {
        setRecentNotifications(recentRes.data);
      }
    } catch (err) {
      console.error('Error loading bus alerts data:', err);
      setErrorMessage(err.message || 'Unable to load bus alerts from MySQL database.');
    } finally {
      setLoading(false);
    }
  }, [priorityFilter]);

  // Initial load and filter change
  useEffect(() => {
    loadData(priorityFilter);
  }, [priorityFilter, loadData]);

  // Real-Time Socket.IO Synchronization
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_police_admin');
    });

    const handleRealtimeAlert = () => {
      // Refresh current alerts and charts when new alert is received
      loadData(priorityFilter);
    };

    socket.on('bus_alert_created', handleRealtimeAlert);
    socket.on('bus_alert_updated', handleRealtimeAlert);
    socket.on('bus_summary_updated', (newSummary) => {
      if (newSummary) setSummary(newSummary);
    });

    return () => {
      socket.off('bus_alert_created', handleRealtimeAlert);
      socket.off('bus_alert_updated', handleRealtimeAlert);
      socket.off('bus_summary_updated');
      socket.disconnect();
    };
  }, [loadData, priorityFilter]);

  const handleResetFilters = () => {
    setPriorityFilter('All');
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await policeBusAlertService.exportPdf(priorityFilter);
    } catch (err) {
      console.error('Bus alerts export error:', err);
      alert('Unable to generate Bus Alerts PDF report.');
    } finally {
      setExporting(false);
    }
  };

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
          <BusAlertStats stats={summary} />

          {/* Priority Filter & Export Bar */}
          <BusAlertFilters
            priorityFilter={priorityFilter}
            onPriorityChange={(val) => {
              setPriorityFilter(val);
              setCurrentPage(1);
            }}
            onReset={handleResetFilters}
            onExport={handleExport}
            exporting={exporting}
          />

          {/* Error Banner */}
          {errorMessage && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #F87171',
              borderRadius: '8px',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#B91C1C',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => loadData(priorityFilter)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B91C1C',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {/* Main Grid: Left Table, Right Widgets */}
          <div className="bus-alerts-main-grid">
            {/* All Bus Alerts Table */}
            <div style={{ minWidth: 0 }}>
              {loading ? (
                <div className="bus-alerts-table-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: '#0047FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <p style={{ margin: 0, fontWeight: 500 }}>Loading live bus alerts from MySQL...</p>
                </div>
              ) : (
                <BusAlertsTable
                  alerts={alerts}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>

            {/* Right Sidebar Widgets */}
            <div className="bus-alerts-right-column">
              <BusAlertPriorityChart data={charts.priorityDistribution} />
              <BusAlertWeeklyChart 
                data={charts.weeklyOverview} 
                totalWeeklyAlerts={charts.totalWeeklyAlerts} 
              />
              <RecentNotifications notifications={recentNotifications} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PoliceBusAlertsPage;
