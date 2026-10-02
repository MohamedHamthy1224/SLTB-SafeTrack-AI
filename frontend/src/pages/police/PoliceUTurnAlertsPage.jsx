import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import UTurnAlertSummaryCards from '../../components/police/UTurnAlertSummaryCards';
import UTurnAlertFilter from '../../components/police/UTurnAlertFilter';
import UTurnAlertTable from '../../components/police/UTurnAlertTable';
import UTurnAlertPriorityChart from '../../components/police/UTurnAlertPriorityChart';
import UTurnAlertWeeklyChart from '../../components/police/UTurnAlertWeeklyChart';
import UTurnRecentNotifications from '../../components/police/UTurnRecentNotifications';
import policeUTurnAlertService from '../../services/policeUTurnAlertService';
import '../../styles/police-dashboard.css';
import '../../styles/uTurnAlerts.css';

export const PoliceUTurnAlertsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [priorities, setPriorities] = useState(['High', 'Medium', 'Low']);

  // Data states
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, highAlerts: 0, mediumAlerts: 0, lowAlerts: 0 });
  const [charts, setCharts] = useState({ priorityDistribution: [], weeklyOverview: [] });
  const [notifications, setNotifications] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef(null);

  // Fetch initial REST data
  const loadAlerts = useCallback(async (selectedPriority = priorityFilter) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const params = selectedPriority && selectedPriority !== 'all' ? { priority: selectedPriority } : {};
      const [alertsRes, summaryRes, chartsRes, recentRes, prioritiesRes] = await Promise.all([
        policeUTurnAlertService.getAlerts(params),
        policeUTurnAlertService.getSummary(),
        policeUTurnAlertService.getCharts(),
        policeUTurnAlertService.getRecentNotifications(5),
        policeUTurnAlertService.getPriorities()
      ]);

      if (alertsRes && alertsRes.data) {
        setAlerts(alertsRes.data);
      }
      if (summaryRes && summaryRes.data) {
        setSummary(summaryRes.data);
      }
      if (chartsRes && chartsRes.data) {
        setCharts(chartsRes.data);
      }
      if (recentRes && recentRes.data) {
        setNotifications(recentRes.data);
      }
      if (prioritiesRes && prioritiesRes.data && Array.isArray(prioritiesRes.data)) {
        setPriorities(prioritiesRes.data);
      }
    } catch (err) {
      console.error('Error loading U-Turn alerts:', err);
      setErrorMessage(err.message || 'Failed to load U-Turn alert data from MySQL database.');
    } finally {
      setLoading(false);
    }
  }, [priorityFilter]);

  // Initial load
  useEffect(() => {
    loadAlerts(priorityFilter);
  }, [priorityFilter, loadAlerts]);

  // Socket.IO Real-Time Synchronization
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join_police_admin');
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    // Real-time alert created handler
    const handleAlertCreated = (newAlert) => {
      if (!newAlert) return;

      // Guard: reject any payload without a real persisted roadsideAlertId.
      // This prevents fake/temporary IDs from ever entering the table.
      const alertId = newAlert.roadsideAlertId ?? newAlert.id;
      if (!alertId || typeof alertId !== 'number') {
        console.warn('[Socket] roadside_alert_created ignored — missing valid roadsideAlertId', newAlert);
        return;
      }

      // Update alert list if matches filter
      setAlerts((prevAlerts) => {
        const matchesFilter =
          priorityFilter === 'all' ||
          String(newAlert.priority || '').toLowerCase() === String(priorityFilter).toLowerCase();

        if (matchesFilter) {
          // Avoid duplicate insertion by roadsideAlertId
          const exists = prevAlerts.some(
            (a) => (a.roadsideAlertId || a.id) === alertId
          );
          if (exists) return prevAlerts;
          return [{ ...newAlert, roadsideAlertId: alertId, id: alertId }, ...prevAlerts];
        }
        return prevAlerts;
      });

      // Update recent notifications list using the real notificationId from the backend
      setNotifications((prevNotifs) => {
        const notifId = newAlert.notificationId ?? alertId;
        const notifItem = {
          id: notifId,
          notificationId: notifId,
          title: newAlert.notificationTitle || 'U-Turn Alert',
          message: newAlert.message || 'New U-Turn maneuver detected',
          desc: newAlert.message || 'New U-Turn maneuver detected',
          priority: newAlert.priority || 'Medium',
          time: 'Just now',
          createdAt: newAlert.alertTime || new Date().toISOString()
        };
        return [notifItem, ...prevNotifs.slice(0, 4)];
      });

      // Re-fetch charts to keep analytics synchronized
      policeUTurnAlertService.getCharts().then((res) => {
        if (res && res.data) setCharts(res.data);
      }).catch(() => {});
    };

    // Real-time summary updated handler
    const handleSummaryUpdated = (newSummary) => {
      if (newSummary) {
        setSummary(newSummary);
      }
    };

    socket.on('roadside_alert_created', handleAlertCreated);
    socket.on('roadside_alert_summary_updated', handleSummaryUpdated);

    return () => {
      socket.off('roadside_alert_created', handleAlertCreated);
      socket.off('roadside_alert_summary_updated', handleSummaryUpdated);
      socket.disconnect();
    };
  }, [priorityFilter]);

  // Priority filter change
  const handlePriorityChange = (newPriority) => {
    setPriorityFilter(newPriority);
  };

  // Reset filter
  const handleReset = () => {
    setPriorityFilter('all');
  };

  // Export PDF
  const handleExport = async () => {
    setExporting(true);
    try {
      await policeUTurnAlertService.exportPdf(priorityFilter);
    } catch (err) {
      console.error('Export PDF error:', err);
      alert('Failed to generate and download PDF report. Please try again.');
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

        {/* Page Content */}
        <main className="uturn-alerts-container">
          {/* Page Title & Breadcrumb */}
          <div className="uturn-alerts-header-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h1 className="uturn-alerts-page-title">U-Turn Alerts</h1>
                <nav className="uturn-alerts-breadcrumb">
                  <Link to="/police/dashboard">Dashboard</Link>
                  <span className="breadcrumb-separator">&gt;</span>
                  <span className="breadcrumb-current">U-Turn Alerts</span>
                </nav>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '999px',
                    background: socketConnected ? '#ecfdf5' : '#fef2f2',
                    color: socketConnected ? '#059669' : '#dc2626',
                    border: `1px solid ${socketConnected ? '#a7f3d0' : '#fecaca'}`
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: socketConnected ? '#10b981' : '#ef4444'
                    }}
                  />
                  {socketConnected ? 'Live Socket Connected' : 'Connecting Real-Time...'}
                </span>
                <button
                  className="btn-reset"
                  onClick={() => loadAlerts(priorityFilter)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  type="button"
                  title="Reload from MySQL"
                >
                  <RefreshCw size={13} className={loading ? 'spin-icon' : ''} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Error Banner if any */}
          {errorMessage && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.85rem 1.25rem',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} color="#dc2626" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => loadAlerts(priorityFilter)}
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.78rem'
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* 4 KPI Summary Cards */}
          <UTurnAlertSummaryCards stats={summary} />

          {/* Filter Toolbar */}
          <UTurnAlertFilter
            priority={priorityFilter}
            onPriorityChange={handlePriorityChange}
            onReset={handleReset}
            onExport={handleExport}
            exporting={exporting}
            priorities={priorities}
          />

          {/* Main Two-Column Layout */}
          <div className="uturn-alerts-main-grid">
            {/* Left: Table */}
            <div style={{ minWidth: 0 }}>
              <UTurnAlertTable alerts={alerts} loading={loading} />
            </div>

            {/* Right: Analytics Widgets */}
            <div className="uturn-alerts-right-column">
              <UTurnAlertPriorityChart distribution={charts.priorityDistribution} />
              <UTurnAlertWeeklyChart weeklyData={charts.weeklyOverview} />
              <UTurnRecentNotifications notifications={notifications} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PoliceUTurnAlertsPage;
