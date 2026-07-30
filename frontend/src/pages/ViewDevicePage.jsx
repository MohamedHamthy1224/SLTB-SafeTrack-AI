import React, { useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import DeviceTopSummaryCard from '../components/police/device/DeviceTopSummaryCard';
import DeviceInformationCard from '../components/police/device/DeviceInformationCard';
import { mockDeviceData } from '../data/deviceMockData';
import '../styles/police-dashboard.css';
import '../styles/viewDevice.css';

export const ViewDevicePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Resolve device from router state or mock data
  const selectedDevice =
    location.state?.device ||
    mockDeviceData.find((d) => String(d.id) === String(id)) ||
    mockDeviceData[0];

  const handleEdit = () => {
    navigate(`/police/device-management/${selectedDevice.id}/edit`, {
      state: { device: selectedDevice },
    });
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
          {/* Breadcrumb */}
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
            <button className="btn-view-edit" onClick={handleEdit}>
              <Pencil size={14} />
              Edit Device
            </button>
          </div>

          {/* Top Summary Strip */}
          <DeviceTopSummaryCard device={selectedDevice} />

          {/* Full Device Info Card */}
          <DeviceInformationCard device={selectedDevice} />
        </main>
      </div>
    </div>
  );
};

export default ViewDevicePage;
