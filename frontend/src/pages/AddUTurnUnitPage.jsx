import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import {
  uturnDeviceOptions,
  uturnRouteOptions,
  uturnStatusOptions,
} from '../data/uturnManagementMockData';
import '../styles/police-dashboard.css';
import '../styles/uturnManagement.css';

export const AddUTurnUnitPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deviceId: '',
    routeId: '',
    locationName: '',
    latitude: '',
    longitude: '',
    installationDate: '',
    status: '',
  });

  const [errors, setErrors] = useState({});

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

  const handleSave = () => {
    if (validate()) {
      // Temporary frontend save: navigate back to list
      navigate('/police/uturn-management');
    }
  };

  const handleCancel = () => {
    navigate('/police/uturn-management');
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

        <main className="uturn-add-container">
          {/* Header Title & Breadcrumb */}
          <div className="uturn-header-section">
            <h1 className="uturn-page-title">Add New U-Turn Unit</h1>
            <nav className="uturn-breadcrumb">
              <Link to="/police/uturn-management">U-Turn Management</Link>
              <span className="bc-sep">&gt;</span>
              <span className="bc-current">Add New U-Turn Unit</span>
            </nav>
          </div>

          {/* Form Card */}
          <div className="uturn-form-card">
            <div className="uturn-section-header">
              <div className="uturn-section-badge">1</div>
              <h2 className="uturn-section-title">U-Turn Unit Information</h2>
            </div>

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
                <span className="uturn-helper-text">Select route if available</span>
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
                  <span className="uturn-helper-text">Enter unit location name</span>
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

            {/* Action Buttons */}
            <div className="uturn-footer-actions">
              <button
                type="button"
                className="btn-uturn-cancel"
                onClick={handleCancel}
              >
                <ArrowLeft size={14} />
                Cancel
              </button>
              <button
                type="button"
                className="btn-uturn-save"
                onClick={handleSave}
              >
                <Save size={15} />
                Save U-Turn Unit
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddUTurnUnitPage;
