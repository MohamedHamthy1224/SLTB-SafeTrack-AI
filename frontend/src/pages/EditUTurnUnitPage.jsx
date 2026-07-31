import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Edit2 } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import {
  mockUTurnUnitsList,
  uturnDeviceOptions,
  uturnRouteOptions,
  uturnStatusOptions,
} from '../data/uturnManagementMockData';
import '../styles/police-dashboard.css';
import '../styles/uturnManagement.css';

export const EditUTurnUnitPage = () => {
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

  const [formData, setFormData] = useState({
    deviceId: '',
    routeId: '',
    locationName: '',
    latitude: '',
    longitude: '',
    installationDate: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (unit) {
      setFormData({
        deviceId: unit.deviceId || 'DEV-UT-1001',
        routeId: unit.routeId || 'R-101',
        locationName: unit.locationName || 'Kandy-Matale Junction',
        latitude: unit.latitude || '7.28920000',
        longitude: unit.longitude || '80.63370000',
        installationDate: unit.installationDate || '2024-01-15',
        status: unit.status || 'Active',
      });
    }
  }, [unit]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.deviceId) {
      newErrors.deviceId = 'Select device ID';
    }
    if (!formData.locationName.trim()) {
      newErrors.locationName = 'Enter location name';
    }
    if (!formData.status) {
      newErrors.status = 'Select unit status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validate()) {
      // Frontend-only update: navigate back to unit details page
      navigate(`/police/uturn-management/view/${unit.id}`);
    }
  };

  const handleBackToDetails = () => {
    navigate(`/police/uturn-management/view/${unit.id}`);
  };

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

        <main className="uturn-edit-container">
          {/* Header Title & Top Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit2 size={18} />
                </div>
                <h1 className="uturn-page-title">Edit U-Turn Unit</h1>
              </div>
              <nav className="uturn-breadcrumb">
                <Link to="/police/dashboard">Dashboard</Link>
                <span className="bc-sep">&gt;</span>
                <Link to="/police/uturn-management">U-Turn Management</Link>
                <span className="bc-sep">&gt;</span>
                <span className="bc-current">Edit U-Turn Unit</span>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-uturn-cancel"
                onClick={handleBackToDetails}
              >
                <ArrowLeft size={14} />
                Back to U-Turn Details
              </button>
              <button
                type="button"
                className="btn-uturn-save"
                onClick={handleUpdate}
              >
                <Save size={15} />
                Update U-Turn Unit
              </button>
            </div>
          </div>

          {/* Form Card */}
          <div className="uturn-form-card">
            <h2 className="uturn-section-title" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              U-Turn Unit Information
            </h2>

            <div className="uturn-form-grid">
              {/* Device ID */}
              <div className="uturn-field-group">
                <label className="uturn-label">
                  Device ID <span className="req">*</span>
                </label>
                <select
                  className={`uturn-select ${errors.deviceId ? 'error' : ''}`}
                  value={formData.deviceId}
                  onChange={(e) => handleChange('deviceId', e.target.value)}
                >
                  <option value="">Select device</option>
                  {uturnDeviceOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.deviceId ? (
                  <span className="uturn-error-text">{errors.deviceId}</span>
                ) : (
                  <span className="uturn-helper-text">Select registered device</span>
                )}
              </div>

              {/* Route ID */}
              <div className="uturn-field-group">
                <label className="uturn-label">Route ID</label>
                <select
                  className="uturn-select"
                  value={formData.routeId}
                  onChange={(e) => handleChange('routeId', e.target.value)}
                >
                  <option value="">Select route (optional)</option>
                  {uturnRouteOptions.filter(r => r !== 'All Routes').map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span className="uturn-helper-text">Select route (optional)</span>
              </div>

              {/* Location Name */}
              <div className="uturn-field-group">
                <label className="uturn-label">
                  Location Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className={`uturn-input ${errors.locationName ? 'error' : ''}`}
                  placeholder="Enter location name"
                  value={formData.locationName}
                  onChange={(e) => handleChange('locationName', e.target.value)}
                />
                {errors.locationName ? (
                  <span className="uturn-error-text">{errors.locationName}</span>
                ) : (
                  <span className="uturn-helper-text">Enter location name</span>
                )}
              </div>

              {/* Latitude */}
              <div className="uturn-field-group">
                <label className="uturn-label">Latitude</label>
                <input
                  type="text"
                  className="uturn-input"
                  placeholder="Enter latitude (e.g., 6.9271)"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                />
                <span className="uturn-helper-text">Decimal latitude value</span>
              </div>

              {/* Longitude */}
              <div className="uturn-field-group">
                <label className="uturn-label">Longitude</label>
                <input
                  type="text"
                  className="uturn-input"
                  placeholder="Enter longitude (e.g., 79.8612)"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                />
                <span className="uturn-helper-text">Decimal longitude value</span>
              </div>

              {/* Installation Date */}
              <div className="uturn-field-group">
                <label className="uturn-label">Installation Date</label>
                <div className="uturn-date-wrap">
                  <input
                    type="date"
                    className="uturn-input"
                    value={formData.installationDate}
                    onChange={(e) => handleChange('installationDate', e.target.value)}
                  />
                  <Calendar size={15} className="uturn-date-icon" />
                </div>
                <span className="uturn-helper-text">Choose installation date</span>
              </div>

              {/* Status */}
              <div className="uturn-field-group">
                <label className="uturn-label">
                  Status <span className="req">*</span>
                </label>
                <select
                  className={`uturn-select ${errors.status ? 'error' : ''}`}
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="">Select status</option>
                  {uturnStatusOptions.filter(s => s !== 'All Status').map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.status ? (
                  <span className="uturn-error-text">{errors.status}</span>
                ) : (
                  <span className="uturn-helper-text">Select unit status</span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditUTurnUnitPage;
