import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { PoliceSidebar } from '../../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../../components/police/PoliceDashboardHeader';
import policeUTurnManagementService from '../../services/policeUTurnManagementService';
import '../../styles/police-dashboard.css';
import '../../styles/uturnManagement.css';

const getStatusBadgeClass = (status = '') => {
  const s = String(status).toLowerCase();
  if (s === 'active') return 'badge-uturn-status active';
  if (s === 'maintenance') return 'badge-uturn-status maintenance';
  return 'badge-uturn-status inactive';
};

export const UTurnDetailsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();
  const activeId = params.id || params.unitId;
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!activeId) return;

    const fetchUnitDetails = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await policeUTurnManagementService.getUTurnUnitById(activeId);
        if (res && res.data) {
          setUnit(res.data);
        } else {
          setErrorMessage(`Roadside U-Turn unit #${activeId} not found.`);
        }
      } catch (err) {
        console.error('Failed to load U-Turn unit details:', err);
        setErrorMessage(err.message || 'Unable to retrieve unit details from database.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnitDetails();
  }, [activeId]);

  const unitId = unit?.roadsideUnitId || unit?.roadside_unit_id || unit?.id || activeId;
  const deviceDisplay = unit?.deviceCode
    ? `${unit.deviceCode} (${unit.deviceName || 'Roadside Unit'})`
    : (unit?.deviceId ? `Device #${unit.deviceId}` : '—');

  const routeDisplay = unit?.routeNumber
    ? `Route ${unit.routeNumber} — ${unit.routeName || ''}`
    : (unit?.routeId ? `Route #${unit.routeId}` : 'Not Assigned');

  const latDisplay = unit?.latitude !== null && unit?.latitude !== undefined
    ? Number(unit.latitude).toFixed(6)
    : '—';

  const lngDisplay = unit?.longitude !== null && unit?.longitude !== undefined
    ? Number(unit.longitude).toFixed(6)
    : '—';

  return (
    <div className="police-dashboard-layout">
      {/* Sidebar */}
      <PoliceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="police-dashboard-main">
        <PoliceDashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="uturn-details-container">
          {/* Header Row */}
          <div className="uturn-header-row">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Radio size={20} />
                </div>
                <div>
                  <h1 className="uturn-page-title">
                    {isLoading ? 'Loading U-Turn Unit...' : (unit ? unit.locationName : `Unit #${activeId}`)}
                  </h1>
                </div>
              </div>
              <nav className="uturn-breadcrumb">
                <Link to="/police/dashboard">Dashboard</Link>
                <span className="bc-sep">&gt;</span>
                <Link to="/police/u-turn-management">U-Turn Management</Link>
                <span className="bc-sep">&gt;</span>
                <span className="bc-current">Unit #{activeId} Details</span>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/police/u-turn-management" className="btn-uturn-cancel">
                <ArrowLeft size={14} />
                Back to U-Turn Management
              </Link>
              {unit && (
                <button
                  type="button"
                  className="btn-uturn-save"
                  onClick={() => navigate(`/police/u-turn-management/edit/${unitId}`)}
                >
                  <Edit2 size={14} />
                  Edit U-Turn Unit
                </button>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="uturn-alert-banner error" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoading ? (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
              <div className="uturn-spinner" style={{ width: 32, height: 32, margin: '0 auto 1rem' }}></div>
              <p>Fetching roadside U-turn unit #{activeId} details from database...</p>
            </div>
          ) : !unit ? (
            <div className="uturn-empty-state" style={{ padding: '4rem 1rem' }}>
              <div className="uturn-empty-icon">⚠️</div>
              <h3 className="uturn-empty-title">Unit Not Found</h3>
              <p className="uturn-empty-desc">The requested U-turn unit #{activeId} does not exist in the database.</p>
              <Link to="/police/u-turn-management" className="btn-uturn-add" style={{ display: 'inline-flex', marginTop: '1.25rem' }}>
                Return to U-Turn Management
              </Link>
            </div>
          ) : (
            <>
              {/* 6 Top Mini Stat Cards Grid */}
              <div className="uturn-top-minicards-grid">
                {/* Roadside Unit ID */}
                <div className="uturn-minicard">
                  <div className="uturn-minicard-icon">
                    <Radio size={18} />
                  </div>
                  <span className="uturn-minicard-label">Roadside Unit ID</span>
                  <span className="uturn-minicard-value">#{unitId}</span>
                </div>

                {/* Device ID */}
                <div className="uturn-minicard">
                  <div className="uturn-minicard-icon">
                    <Cpu size={18} />
                  </div>
                  <span className="uturn-minicard-label">Device ID</span>
                  <span className="uturn-minicard-value" title={unit.deviceName || ''}>
                    {unit.deviceCode || `DEV-${unit.deviceId}`}
                  </span>
                </div>

                {/* Route ID */}
                <div className="uturn-minicard">
                  <div className="uturn-minicard-icon">
                    <MapPin size={18} />
                  </div>
                  <span className="uturn-minicard-label">Route</span>
                  <span className="uturn-minicard-value" style={{ fontSize: '0.9rem' }}>
                    {unit.routeNumber ? `Route ${unit.routeNumber}` : (unit.routeId ? `Route #${unit.routeId}` : '—')}
                  </span>
                </div>

                {/* Status */}
                <div className="uturn-minicard">
                  <div className="uturn-minicard-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <span className="uturn-minicard-label">Operational Status</span>
                  <div>
                    <span className={getStatusBadgeClass(unit.status)}>
                      {unit.status || 'Active'}
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
                    {unit.installationDate || unit.installation_date || '—'}
                  </span>
                </div>

                {/* Created At */}
                <div className="uturn-minicard">
                  <div className="uturn-minicard-icon">
                    <Clock size={18} />
                  </div>
                  <span className="uturn-minicard-label">Registered At</span>
                  <span className="uturn-minicard-value" style={{ fontSize: '0.85rem' }}>
                    {unit.createdAt || unit.created_at || '—'}
                  </span>
                </div>
              </div>

              {/* Main Information Card */}
              <div className="uturn-details-card">
                <h2 className="uturn-section-title" style={{ fontSize: '1.1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  Roadside U-Turn Unit Detailed Information
                </h2>

                <div className="uturn-details-grid">
                  {/* Left Column */}
                  <div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">Roadside Unit ID</span>
                      <span className="uturn-detail-value">#{unitId}</span>
                    </div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">Assigned Hardware Device</span>
                      <span className="uturn-detail-value">{deviceDisplay}</span>
                    </div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">Bus Route</span>
                      <span className="uturn-detail-value">{routeDisplay}</span>
                    </div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">Location Name</span>
                      <span className="uturn-detail-value">{unit.locationName || unit.location_name}</span>
                    </div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">GPS Latitude</span>
                      <span className="uturn-detail-value">{latDisplay}</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">GPS Longitude</span>
                      <span className="uturn-detail-value">{lngDisplay}</span>
                    </div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">Hardware Installation Date</span>
                      <span className="uturn-detail-value">{unit.installationDate || unit.installation_date || '—'}</span>
                    </div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">Status</span>
                      <span className={getStatusBadgeClass(unit.status)}>
                        {unit.status || 'Active'}
                      </span>
                    </div>
                    <div className="uturn-detail-row">
                      <span className="uturn-detail-label">System Registration Timestamp</span>
                      <span className="uturn-detail-value">{unit.createdAt || unit.created_at || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UTurnDetailsPage;
