import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { 
  Bus, 
  User, 
  MapPin, 
  Cpu, 
  CornerUpRight, 
  Network, 
  BellRing, 
  AlertTriangle, 
  ShieldCheck, 
  Users,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import { PoliceStatCard } from '../components/police/PoliceStatCard';
import { PoliceSafetyCard } from '../components/police/PoliceSafetyCard';
import { PoliceUTurnCard } from '../components/police/PoliceUTurnCard';
import { AlertsChart } from '../components/police/AlertsChart';
import policeDashboardService from '../services/policeDashboardService';
import '../styles/police-dashboard.css';

export const PoliceDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Live Dashboard State
  const [dashboardData, setDashboardData] = useState({
    statistics: {
      totalBuses: 0,
      totalDrivers: 0,
      totalRoutes: 0,
      busDevices: 0,
      uturnDevices: 0,
      totalDevices: 0,
      busAlerts: 0,
      uturnAlerts: 0,
      policeOfficers: 0,
      sltbUsers: 0
    },
    busSafety: null,
    uturnSafety: null,
    alertsOverview: {
      chartData: []
    },
    systemStatus: {
      statusText: 'All Systems Operational',
      isOperational: true,
      lastUpdated: null
    }
  });

  const socketRef = useRef(null);

  // Fetch Dashboard Data from Backend
  const loadDashboard = useCallback(async (period = selectedWeek) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await policeDashboardService.getDashboardData({ period });
      if (response && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Error loading police dashboard:', err);
      setErrorMessage(err.message || 'Unable to load live dashboard telemetry.');
    } finally {
      setLoading(false);
    }
  }, [selectedWeek]);

  // Initial Load
  useEffect(() => {
    loadDashboard(selectedWeek);
  }, [selectedWeek, loadDashboard]);

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

    // Targeted real-time listeners
    const handleRealtimeUpdate = () => {
      loadDashboard(selectedWeek);
    };

    // Live U-Turn sensor card update — no REST round-trip needed
    const handleUTurnSensorUpdate = (payload) => {
      if (!payload) return;
      setDashboardData((prev) => ({
        ...prev,
        uturnSafety: {
          leftSensor: payload.leftSensor || prev.uturnSafety?.leftSensor,
          rightSensor: payload.rightSensor || prev.uturnSafety?.rightSensor,
        }
      }));
    };

    socket.on('bus_alert_created', handleRealtimeUpdate);
    socket.on('bus_alert_updated', handleRealtimeUpdate);
    socket.on('roadside_alert_created', handleRealtimeUpdate);
    socket.on('roadside_alert_updated', handleRealtimeUpdate);
    socket.on('device_status_updated', handleRealtimeUpdate);
    socket.on('device_created', handleRealtimeUpdate);
    socket.on('user_created', handleRealtimeUpdate);
    socket.on('user_updated', handleRealtimeUpdate);
    socket.on('uturn_sensor_update', handleUTurnSensorUpdate);

    return () => {
      socket.off('bus_alert_created', handleRealtimeUpdate);
      socket.off('bus_alert_updated', handleRealtimeUpdate);
      socket.off('roadside_alert_created', handleRealtimeUpdate);
      socket.off('roadside_alert_updated', handleRealtimeUpdate);
      socket.off('device_status_updated', handleRealtimeUpdate);
      socket.off('device_created', handleRealtimeUpdate);
      socket.off('user_created', handleRealtimeUpdate);
      socket.off('user_updated', handleRealtimeUpdate);
      socket.off('uturn_sensor_update', handleUTurnSensorUpdate);
      socket.disconnect();
    };
  }, [selectedWeek, loadDashboard]);

  const handleWeekChange = (newPeriod) => {
    setSelectedWeek(newPeriod);
  };

  const stats = dashboardData.statistics || {};

  const statsCards = [
    { title: 'Total Buses', value: String(stats.totalBuses ?? 0), icon: Bus, iconBg: '#EBF3FF', iconColor: '#1D61E7' },
    { title: 'Total Drivers', value: String(stats.totalDrivers ?? 0), icon: User, iconBg: '#EBF8F2', iconColor: '#10B981' },
    { title: 'Total Routes', value: String(stats.totalRoutes ?? 0), icon: MapPin, iconBg: '#F5EEFE', iconColor: '#9333EA' },
    { title: 'Bus Devices', value: String(stats.busDevices ?? 0), icon: Cpu, iconBg: '#E6F7F7', iconColor: '#06B6D4' },
    { title: 'U-Turn Devices', value: String(stats.uturnDevices ?? 0), icon: CornerUpRight, iconBg: '#FFF4E5', iconColor: '#F97316' },
    { title: 'Total Devices', value: String(stats.totalDevices ?? 0), icon: Network, iconBg: '#EEF2FF', iconColor: '#4F46E5' },
    { title: 'Bus Alerts', value: String(stats.busAlerts ?? 0), icon: BellRing, iconBg: '#FEE2E2', iconColor: '#EF4444' },
    { title: 'U-Turn Alerts', value: String(stats.uturnAlerts ?? 0), icon: AlertTriangle, iconBg: '#FEF3C7', iconColor: '#F59E0B' },
    { title: 'Police Officers', value: String(stats.policeOfficers ?? 0), icon: ShieldCheck, iconBg: '#E0F2FE', iconColor: '#0284C7' },
    { title: 'SLTB Users', value: String(stats.sltbUsers ?? 0), icon: Users, iconBg: '#F3E8FF', iconColor: '#7E22CE' }
  ];

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

        {/* Dashboard Body Content */}
        <main className="police-dashboard-content">
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
                onClick={() => loadDashboard(selectedWeek)}
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

          {/* Top 10 Statistics Cards Grid */}
          <section className="police-stats-grid">
            {statsCards.map((stat) => (
              <PoliceStatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBg={stat.iconBg}
                iconColor={stat.iconColor}
              />
            ))}
          </section>

          {/* Middle Row: Bus Safety Monitor & U-Turn Safety Monitor */}
          <section className="police-monitors-row">
            <PoliceSafetyCard data={dashboardData.busSafety} />
            <PoliceUTurnCard data={dashboardData.uturnSafety} />
          </section>

          {/* Bottom Section: Alerts Overview Line Chart */}
          <section>
            <AlertsChart 
              data={dashboardData.alertsOverview?.chartData}
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default PoliceDashboard;
