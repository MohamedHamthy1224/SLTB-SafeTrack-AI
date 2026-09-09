import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Loader2 } from 'lucide-react';
import io from 'socket.io-client';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import SystemLogSummaryCards from '../components/police/systemLogs/SystemLogSummaryCards';
import SystemLogFilterBar from '../components/police/systemLogs/SystemLogFilterBar';
import SystemLogTable from '../components/police/systemLogs/SystemLogTable';
import SystemLogPagination from '../components/police/systemLogs/SystemLogPagination';
import ActivityChart from '../components/police/systemLogs/ActivityChart';
import UserDistributionChart from '../components/police/systemLogs/UserDistributionChart';
import RecentActivitiesCard from '../components/police/systemLogs/RecentActivitiesCard';
import { policeSystemLogService } from '../services/policeSystemLogService';
import '../styles/police-dashboard.css';
import '../styles/systemLogs.css';

const ITEMS_PER_PAGE = 10;
let globalLogSocket = null;

export const PoliceSystemLogsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [stats, setStats] = useState({
    totalActivities: 0,
    uniqueUsers: 0,
    todayActivities: 0,
    weeklyActivities: 0
  });
  const [logs, setLogs] = useState([]);
  const [userOptions, setUserOptions] = useState(['All Users']);
  const [activityByDay, setActivityByDay] = useState([]);
  const [userDistribution, setUserDistribution] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState('All Users');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch initial data
  const fetchData = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, logsRes, usersRes, chartRes, distRes, recentRes] = await Promise.all([
        policeSystemLogService.getSummary(),
        policeSystemLogService.getLogs(filters),
        policeSystemLogService.getUserOptions(),
        policeSystemLogService.getActivityByDay(),
        policeSystemLogService.getUserDistribution(),
        policeSystemLogService.getRecentActivities(10)
      ]);

      const extractData = (res) => (res && res.success !== undefined ? res.data : res);

      const summaryData = extractData(summaryRes);
      const logsData = extractData(logsRes);
      const usersData = extractData(usersRes);
      const chartData = extractData(chartRes);
      const distData = extractData(distRes);
      const recentData = extractData(recentRes);

      if (summaryData && typeof summaryData === 'object') setStats(summaryData);
      if (Array.isArray(logsData)) setLogs(logsData);
      else if (logsData && Array.isArray(logsData.logs)) setLogs(logsData.logs);

      if (Array.isArray(usersData)) setUserOptions(['All Users', ...usersData]);
      if (Array.isArray(chartData)) setActivityByDay(chartData);
      if (Array.isArray(distData)) setUserDistribution(distData);
      if (Array.isArray(recentData)) setRecentActivities(recentData);
    } catch (err) {
      console.error('[PoliceSystemLogsPage] load error:', err);
      setError('Unable to load system logs. Please check server connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time Socket.IO integration
  useEffect(() => {
    if (!globalLogSocket) {
      const backendUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
      globalLogSocket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000
      });
      globalLogSocket.emit('join_sltb_admin');
    }

    const handleSystemLogCreated = (newLog) => {
      if (!newLog) return;

      setLogs((prevLogs) => [newLog, ...prevLogs]);
      setRecentActivities((prev) => [newLog, ...prev.slice(0, 9)]);

      setStats((prev) => ({
        ...prev,
        totalActivities: prev.totalActivities + 1,
        todayActivities: prev.todayActivities + 1,
        weeklyActivities: prev.weeklyActivities + 1
      }));
    };

    const handleReconnect = () => {
      // Re-synchronize with MySQL after socket reconnection
      fetchData();
    };

    globalLogSocket.off('system_log_created', handleSystemLogCreated);
    globalLogSocket.on('system_log_created', handleSystemLogCreated);
    globalLogSocket.on('connect', handleReconnect);

    return () => {
      if (globalLogSocket) {
        globalLogSocket.off('system_log_created', handleSystemLogCreated);
        globalLogSocket.off('connect', handleReconnect);
      }
    };
  }, [fetchData]);

  // Apply filters via API call
  const handleApplyFilter = async (kw, uId) => {
    setCurrentPage(1);
    const params = {};
    if (kw) params.keyword = kw;
    if (uId && uId !== 'All Users') params.userId = uId;
    await fetchData(params);
  };

  const handleSearchChange = (val) => {
    setSearchValue(val);
    handleApplyFilter(val, selectedUser);
  };

  const handleUserChange = (val) => {
    setSelectedUser(val);
    handleApplyFilter(searchValue, val);
  };

  const handleReset = () => {
    setSearchValue('');
    setSelectedUser('All Users');
    setCurrentPage(1);
    fetchData();
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (searchValue) params.keyword = searchValue;
      if (selectedUser && selectedUser !== 'All Users') params.userId = selectedUser;
      await policeSystemLogService.exportPdf(params);
    } catch (err) {
      console.error('[PoliceSystemLogsPage] export error:', err);
      alert('Unable to generate PDF report.');
    }
  };

  // Pagination slicing
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = logs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', color: '#64748b' }}>
              <Loader2 size={36} className="spinner" style={{ marginBottom: '0.75rem' }} />
              <p>Loading real-time system logs...</p>
            </div>
          ) : error ? (
            <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem', background: '#ffffff', borderRadius: '12px' }}>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <SystemLogSummaryCards stats={stats} />

              {/* Filter Bar */}
              <SystemLogFilterBar
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                selectedUser={selectedUser}
                onUserChange={handleUserChange}
                userOptions={userOptions}
                dateRange="Real-Time Data"
                onReset={handleReset}
                onExport={handleExport}
              />

              {/* System Logs Table */}
              <SystemLogTable logs={paginatedLogs} />

              {/* Pagination */}
              <SystemLogPagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalItems={logs.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />

              {/* Bottom Analytics Row */}
              <div className="syslog-analytics-grid" style={{ marginTop: '1.15rem' }}>
                <ActivityChart data={activityByDay} />
                <UserDistributionChart
                  data={userDistribution}
                  totalActivities={stats.totalActivities}
                />
                <RecentActivitiesCard activities={recentActivities} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default PoliceSystemLogsPage;
