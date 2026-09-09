import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import DeviceDetails from '../../components/police/deviceManagement/DeviceDetails';
import policeDeviceService from '../../services/policeDeviceService';

import '../../styles/police-dashboard.css';
import '../../styles/policeDeviceManagement.css';

export const DeviceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch device details directly from database by ID
  const fetchDeviceDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await policeDeviceService.getDeviceById(id);
      if (res && res.data) {
        setDevice(res.data);
      } else {
        setError('Device record not found.');
      }
    } catch (err) {
      console.error('Failed to fetch device details:', err);
      setError(err?.message || 'Unable to load device details from server.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDeviceDetails();
  }, [fetchDeviceDetails]);

  const handleEdit = () => {
    navigate(`/police/device-management/edit/${id}`);
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
        <main className="view-device-container">
          {/* Breadcrumb Navigation */}
          <nav className="view-device-breadcrumb">
            <Link to="/police/dashboard">Dashboard</Link>
            <span className="bc-sep">&gt;</span>
            <Link to="/police/device-management">Device Management</Link>
            <span className="bc-sep">&gt;</span>
            <span className="bc-current">Device Details</span>
          </nav>

          {/* Action Buttons Row */}
          <div className="view-device-actions-row">
            <Link to="/police/device-management" className="btn-view-back">
              <ArrowLeft size={14} />
              Back to Device Management
            </Link>

            <button className="btn-view-edit" onClick={handleEdit} disabled={!device || loading}>
              <Pencil size={14} />
              Edit Device
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '1rem',
                color: '#dc2626',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              ⚠ {error}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32 }} />
              Loading device details from database...
            </div>
          )}

          {/* Device Details Component */}
          {!loading && device && <DeviceDetails device={device} />}
        </main>
      </div>
    </div>
  );
};

export default DeviceDetailsPage;
