import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Cpu,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  Radio,
} from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import { mockUTurnUnitsList } from '../data/uturnManagementMockData';
import '../styles/police-dashboard.css';
import '../styles/uturnManagement.css';

export const UTurnDetailsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();
  const activeId = params.id || params.unitId;
  const navigate = useNavigate();

  // Find unit by ID or default to first mock unit
  const unit =
    mockUTurnUnitsList.find(
      (u) =>
        String(u.id) === String(activeId) ||
        String(u.unitId) === String(activeId) ||
        String(u.roadsideUnitId) === String(activeId)
    ) || mockUTurnUnitsList[0];

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout */}
      <div className="police-dashboard-main">
        <PoliceDashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="uturn-details-container">
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit2 size={18} />
                </div>
                <h1 className="uturn-page-title">U-Turn Details</h1>
              </div>
              <nav className="uturn-breadcrumb">
                <Link to="/police/dashboard">Dashboard</Link>
                <span className="bc-sep">&gt;</span>
                <Link to="/police/uturn-management">U-Turn Management</Link>
                <span className="bc-sep">&gt;</span>
                <span className="bc-current">U-Turn Details</span>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/police/uturn-management" className="btn-uturn-cancel">
                <ArrowLeft size={14} />
                Back to U-Turn Management
              </Link>
              <button
                type="button"
                className="btn-uturn-save"
                onClick={() => navigate(`/police/uturn-management/edit/${unit.id}`)}
              >
                <Edit2 size={14} />
                Edit U-Turn Unit
              </button>
            </div>
          </div>

          {/* 6 Top Mini Stat Cards Grid */}
          <div className="uturn-top-minicards-grid">
            {/* Roadside Unit ID */}
            <div className="uturn-minicard">
              <div className="uturn-minicard-icon">
                <Radio size={18} />
              </div>
              <span className="uturn-minicard-label">Roadside Unit ID</span>
              <span className="uturn-minicard-value">{unit.unitId}</span>
            </div>

            {/* Device ID */}
            <div className="uturn-minicard">
              <div className="uturn-minicard-icon">
                <Cpu size={18} />
              </div>
              <span className="uturn-minicard-label">Device ID</span>
              <span className="uturn-minicard-value">{unit.deviceId}</span>
            </div>

            {/* Route ID */}
            <div className="uturn-minicard">
              <div className="uturn-minicard-icon">
                <MapPin size={18} />
              </div>
              <span className="uturn-minicard-label">Route ID</span>
              <span className="uturn-minicard-value">{unit.routeId}</span>
            </div>

            {/* Status */}
            <div className="uturn-minicard">
              <div className="uturn-minicard-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <ShieldCheck size={18} />
              </div>
              <span className="uturn-minicard-label">Status</span>
              <div>
                <span className={`badge-uturn-status ${unit.status.toLowerCase()}`}>
                  {unit.status}
                </span>
              </div>
            </div>

            {/* Installation Date */}
            <div className="uturn-minicard">
              <div className="uturn-minicard-icon">
                <Calendar size={18} />
              </div>
              <span className="uturn-minicard-label">Installation Date</span>
              <span className="uturn-minicard-value" style={{ fontSize: '0.9rem' }}>
                {unit.formattedInstallationDate || unit.installationDate}
              </span>
            </div>

            {/* Created At */}
            <div className="uturn-minicard">
              <div className="uturn-minicard-icon">
                <Clock size={18} />
              </div>
              <span className="uturn-minicard-label">Created At</span>
              <span className="uturn-minicard-value" style={{ fontSize: '0.85rem' }}>
                {unit.formattedCreatedAt || unit.createdAt}
              </span>
            </div>
          </div>

          {/* Main Information Card */}
          <div className="uturn-details-card">
            <h2 className="uturn-section-title" style={{ fontSize: '1.1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              U-Turn Unit Information
            </h2>

            <div className="uturn-details-grid">
              {/* Left Column */}
              <div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Roadside Unit ID</span>
                  <span className="uturn-detail-value">{unit.unitId}</span>
                </div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Device ID</span>
                  <span className="uturn-detail-value">{unit.deviceId}</span>
                </div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Route ID</span>
                  <span className="uturn-detail-value">{unit.routeId}</span>
                </div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Location Name</span>
                  <span className="uturn-detail-value">{unit.locationName}</span>
                </div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Latitude</span>
                  <span className="uturn-detail-value">{unit.latitude}</span>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Longitude</span>
                  <span className="uturn-detail-value">{unit.longitude}</span>
                </div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Installation Date</span>
                  <span className="uturn-detail-value">{unit.formattedInstallationDate || unit.installationDate}</span>
                </div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Status</span>
                  <span className={`badge-uturn-status ${unit.status.toLowerCase()}`}>
                    {unit.status}
                  </span>
                </div>
                <div className="uturn-detail-row">
                  <span className="uturn-detail-label">Created At</span>
                  <span className="uturn-detail-value">{unit.formattedCreatedAt || unit.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UTurnDetailsPage;
