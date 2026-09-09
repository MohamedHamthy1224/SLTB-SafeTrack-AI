import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import io from 'socket.io-client';

import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import DeviceSummaryCards from '../../components/police/deviceManagement/DeviceSummaryCards';
import DeviceFilter from '../../components/police/deviceManagement/DeviceFilter';
import DeviceTable from '../../components/police/deviceManagement/DeviceTable';
import policeDeviceService from '../../services/policeDeviceService';

import '../../styles/police-dashboard.css';
import '../../styles/policeDeviceManagement.css';

export const DeviceManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [devices, setDevices] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    busUnits: 0,
    roadsideUnits: 0,
    online: 0,
    maintenance: 0,
  });
  const [deviceTypes, setDeviceTypes] = useState(['Bus Unit', 'Roadside Unit']);
  const [deviceStatuses, setDeviceStatuses] = useState(['Active', 'Inactive', 'Maintenance']);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Filter input states
  const [searchValue, setSearchValue] = useState('');
  const [deviceType, setDeviceType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Applied filter parameters
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    device_type: 'all',
    status: 'all',
  });

  const socketRef = useRef(null);

  // Fetch Summary Cards
  const fetchSummary = useCallback(async () => {
    try {
      const res = await policeDeviceService.getSummary();
      if (res && res.data) {
        setSummaryStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load device summary stats:', err);
    }
  }, []);

  // Fetch Filter Options (Types & Statuses)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [typesRes, statusesRes] = await Promise.all([
        policeDeviceService.getDeviceTypes().catch(() => ({ data: ['Bus Unit', 'Roadside Unit'] })),
        policeDeviceService.getDeviceStatuses().catch(() => ({ data: ['Active', 'Inactive', 'Maintenance'] })),
      ]);
      if (typesRes && typesRes.data) setDeviceTypes(typesRes.data);
      if (statusesRes && statusesRes.data) setDeviceStatuses(statusesRes.data);
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  }, []);

  // Fetch Devices List
  const fetchDevices = useCallback(async (filters = appliedFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.keyword && filters.keyword.trim()) {
        params.keyword = filters.keyword.trim();
      }
      if (filters.device_type && filters.device_type !== 'all') {
        params.device_type = filters.device_type;
      }
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }

      const res = await policeDeviceService.getDevices(params);
      if (res && res.data) {
        setDevices(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to load devices:', err);
      setError(err?.message || 'Failed to fetch device data from server.');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  // Initial Load
  useEffect(() => {
    fetchSummary();
    fetchFilterOptions();
    fetchDevices();
  }, [fetchSummary, fetchFilterOptions, fetchDevices]);

  // Socket.IO Real-Time Synchronization
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join_police_admin');
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    // 1. Device Created
    const handleDeviceCreated = (newDevice) => {
      if (!newDevice) return;
      setDevices((prev) => {
        const id = newDevice.deviceId || newDevice.device_id;
        const exists = prev.some((d) => (d.deviceId || d.device_id) === id);
        if (exists) {
          return prev.map((d) => ((d.deviceId || d.device_id) === id ? { ...d, ...newDevice } : d));
        }
        return [newDevice, ...prev];
      });
      fetchSummary();
    };

    // 2. Device Updated
    const handleDeviceUpdated = (updatedDevice) => {
      if (!updatedDevice) return;
      const id = updatedDevice.deviceId || updatedDevice.device_id;
      setDevices((prev) =>
        prev.map((d) => ((d.deviceId || d.device_id) === id ? { ...d, ...updatedDevice } : d))
      );
      fetchSummary();
    };

    // 3. Device Status Changed (e.g. Inactive)
    const handleDeviceStatusChanged = (statusData) => {
      if (!statusData) return;
      const id = statusData.deviceId || statusData.device_id;
      setDevices((prev) =>
        prev.map((d) =>
          (d.deviceId || d.device_id) === id ? { ...d, status: statusData.status || 'Inactive' } : d
        )
      );
      fetchSummary();
    };

    // 4. Device Assignment Changed
    const handleDeviceAssignmentChanged = (assignmentData) => {
      if (!assignmentData) return;
      const devId = assignmentData.deviceId || assignmentData.device_id;
      setDevices((prev) =>
        prev.map((d) =>
          (d.deviceId || d.device_id) === devId
            ? { ...d, assignment: assignmentData, bus_device: assignmentData }
            : d
        )
      );
      fetchSummary();
    };

    // 5. Device Online Status Changed
    const handleDeviceOnlineStatusChanged = (onlineData) => {
      if (!onlineData) return;
      const id = onlineData.deviceId || onlineData.device_id;
      setDevices((prev) =>
        prev.map((d) =>
          (d.deviceId || d.device_id) === id ? { ...d, isOnline: onlineData.isOnline, is_online: onlineData.isOnline } : d
        )
      );
      fetchSummary();
    };

    // 6. Summary Updated
    const handleDeviceSummaryUpdated = (newSummary) => {
      if (newSummary) {
        setSummaryStats(newSummary);
      }
    };

    socket.on('device_created', handleDeviceCreated);
    socket.on('device_updated', handleDeviceUpdated);
    socket.on('device_status_changed', handleDeviceStatusChanged);
    socket.on('device_assignment_changed', handleDeviceAssignmentChanged);
    socket.on('device_online_status_changed', handleDeviceOnlineStatusChanged);
    socket.on('device_summary_updated', handleDeviceSummaryUpdated);

    return () => {
      socket.off('device_created', handleDeviceCreated);
      socket.off('device_updated', handleDeviceUpdated);
      socket.off('device_status_changed', handleDeviceStatusChanged);
      socket.off('device_assignment_changed', handleDeviceAssignmentChanged);
      socket.off('device_online_status_changed', handleDeviceOnlineStatusChanged);
      socket.off('device_summary_updated', handleDeviceSummaryUpdated);
      socket.disconnect();
    };
  }, [fetchSummary]);

  // Handle Filter Button Click
  const handleFilter = () => {
    const newFilters = {
      keyword: searchValue,
      device_type: deviceType,
      status: statusFilter,
    };
    setAppliedFilters(newFilters);
    fetchDevices(newFilters);
  };

  // Handle Reset Button Click
  const handleReset = () => {
    setSearchValue('');
    setDeviceType('all');
    setStatusFilter('all');
    const resetFilters = {
      keyword: '',
      device_type: 'all',
      status: 'all',
    };
    setAppliedFilters(resetFilters);
    fetchDevices(resetFilters);
  };

  // Handle Set Inactive (Stop icon action)
  const handleSetInactive = async (deviceId) => {
    try {
      const res = await policeDeviceService.setDeviceInactive(deviceId);
      if (res && res.data) {
        setDevices((prev) =>
          prev.map((d) =>
            (d.deviceId || d.device_id) === deviceId ? { ...d, status: 'Inactive' } : d
          )
        );
      }
      fetchSummary();
    } catch (err) {
      console.error('Failed to set device inactive:', err);
      alert(err?.message || 'Failed to update device status to Inactive.');
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
        <main className="device-mgmt-container">
          {/* Page Header Section */}
          <div className="device-mgmt-header-section">
            <div className="device-mgmt-header-left">
              <h1 className="device-mgmt-page-title">Device Management</h1>
              <p className="device-mgmt-page-subtitle">
                Manage all registered bus units and roadside units in real-time.
              </p>
            </div>
            <div className="device-mgmt-header-right">
              {/* Real-time Socket Indicator */}
              <div className="live-status-badge" title={socketConnected ? "Real-time sync active" : "Connecting..."}>
                <span className="live-pulse-dot" style={{ background: socketConnected ? '#16a34a' : '#ca8a04' }} />
                <span>{socketConnected ? 'Live Real-Time' : 'Connecting...'}</span>
              </div>

              {/* Refresh Button */}
              <button
                className="btn-filter-reset"
                onClick={() => { fetchSummary(); fetchDevices(); }}
                title="Refresh data"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RefreshCw size={13} className={loading ? 'spin' : ''} />
                Refresh
              </button>

              {/* Add New Device Button */}
              <Link to="/police/device-management/add" className="btn-add-device">
                <Plus size={15} />
                Add New Device
              </Link>
            </div>
          </div>

          {/* 5 KPI Summary Cards (Fetched dynamically from MySQL device_registry) */}
          <DeviceSummaryCards stats={summaryStats} />

          {/* Filter Bar with Search, Dynamic Type, Dynamic Status, Apply, Reset */}
          <DeviceFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            deviceType={deviceType}
            onDeviceTypeChange={setDeviceType}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            deviceTypes={deviceTypes}
            deviceStatuses={deviceStatuses}
            onReset={handleReset}
            onFilter={handleFilter}
          />

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#dc2626',
                fontSize: '0.825rem',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              ⚠ {error}
            </div>
          )}

          {/* Device Table */}
          <DeviceTable
            devices={devices}
            loading={loading}
            onSetInactive={handleSetInactive}
          />
        </main>
      </div>
    </div>
  );
};

export default DeviceManagementPage;
